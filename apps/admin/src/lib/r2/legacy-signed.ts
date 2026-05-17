import type { APIContext } from 'astro'

type RuntimeEnv = Record<string, unknown>

type UploadResult = {
  key: string
  src: string
}

const MIME_TO_EXTENSION: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

const textEncoder = new TextEncoder()

function getRuntimeEnv(context?: APIContext): RuntimeEnv {
  const runtimeEnv = (context?.locals as APIContext['locals'] & {
    runtime?: { env?: RuntimeEnv }
  })?.runtime?.env

  return runtimeEnv ?? process.env
}

function getStringEnv(env: RuntimeEnv, key: string): string | undefined {
  const value = env[key]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getRequiredEnv(env: RuntimeEnv, key: string): string {
  const value = getStringEnv(env, key)
  if (!value) {
    throw new Error(`缺少环境变量 ${key}`)
  }
  return value
}

function normalizeEndpoint(endpoint: string, bucket: string): string {
  const url = new URL(endpoint)

  if (url.pathname === `/${bucket}` || url.pathname === `/${bucket}/`) {
    url.pathname = '/'
  }

  return url.toString().replace(/\/$/, '')
}

function getPublicBaseUrl(env: RuntimeEnv, endpoint: string, bucket: string): string {
  const configured = getStringEnv(env, 'R2_PUBLIC_URL')
  if (configured) {
    return configured.replace(/\/$/, '')
  }

  const url = new URL(endpoint)
  const path = url.pathname.replace(/\/$/, '')
  const basePath = path.endsWith(`/${bucket}`) ? path : `${path}/${bucket}`
  url.pathname = basePath

  return url.toString().replace(/\/$/, '')
}

function slugifyFilenamePart(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'
}

function createObjectKey(filename: string, extension: string): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const base = filename.replace(/\.[^.]+$/, '')
  const safeName = slugifyFilenamePart(base)

  return `editor/${year}/${month}/${safeName}-${crypto.randomUUID()}.${extension}`
}

function getExtension(file: File): string {
  const fromMime = MIME_TO_EXTENSION[file.type]
  if (fromMime) {
    return fromMime
  }

  const match = /\.([a-z0-9]+)$/i.exec(file.name)
  if (!match) {
    throw new Error('无法识别图片扩展名')
  }

  return match[1].toLowerCase()
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const input = typeof data === 'string' ? textEncoder.encode(data) : data
  return toHex(await crypto.subtle.digest('SHA-256', input))
}

async function hmacSha256(key: Uint8Array | string, data: string): Promise<Uint8Array> {
  const rawKey = typeof key === 'string' ? textEncoder.encode(key) : key
  const cryptoKey = await crypto.subtle.importKey('raw', rawKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, textEncoder.encode(data))
  return new Uint8Array(signature)
}

function formatAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '')
}

function formatShortDate(amzDate: string) {
  return amzDate.slice(0, 8)
}

function encodeKeyForPath(key: string) {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function buildObjectUrl(endpoint: string, bucket: string, key: string): URL {
  const url = new URL(endpoint)
  const basePath = url.pathname.replace(/\/$/, '')
  url.pathname = `${basePath}/${bucket}/${encodeKeyForPath(key)}`.replace(/\/{2,}/g, '/')
  return url
}

async function uploadObjectToR2(
  body: Uint8Array,
  file: File,
  key: string,
  context?: APIContext
) {
  const env = getRuntimeEnv(context)
  const bucket = getRequiredEnv(env, 'R2_BUCKET')
  const endpoint = normalizeEndpoint(getRequiredEnv(env, 'R2_ENDPOINT'), bucket)
  const accessKeyId = getRequiredEnv(env, 'R2_ACCESS_KEY_ID')
  const secretAccessKey = getRequiredEnv(env, 'R2_SECRET_ACCESS_KEY')
  const region = getStringEnv(env, 'R2_REGION') || 'auto'
  const url = buildObjectUrl(endpoint, bucket, key)
  const amzDate = formatAmzDate(new Date())
  const shortDate = formatShortDate(amzDate)
  const payloadHash = await sha256Hex(body)
  const canonicalHeaders = [
    `content-type:${file.type || 'application/octet-stream'}`,
    `host:${url.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n')
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [
    'PUT',
    url.pathname,
    '',
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash,
  ].join('\n')
  const credentialScope = `${shortDate}/${region}/s3/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n')
  const kDate = await hmacSha256(`AWS4${secretAccessKey}`, shortDate)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, 's3')
  const kSigning = await hmacSha256(kService, 'aws4_request')
  const signature = toHex((await hmacSha256(kSigning, stringToSign)).buffer)
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: authorization,
      'Content-Type': file.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Amz-Content-Sha256': payloadHash,
      'X-Amz-Date': amzDate,
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`R2 上传失败: ${response.status} ${await response.text()}`)
  }
}

export async function uploadImageToR2(file: File, context?: APIContext): Promise<UploadResult> {
  const env = getRuntimeEnv(context)
  const bucket = getRequiredEnv(env, 'R2_BUCKET')
  const rawEndpoint = getRequiredEnv(env, 'R2_ENDPOINT')
  const extension = getExtension(file)
  const key = createObjectKey(file.name, extension)
  const body = new Uint8Array(await file.arrayBuffer())
  await uploadObjectToR2(body, file, key, context)

  return {
    key,
    src: `${getPublicBaseUrl(env, rawEndpoint, bucket)}/${key}`,
  }
}
