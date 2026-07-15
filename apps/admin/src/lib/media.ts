export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024
export const STREAM_MAX_DURATION_SECONDS = 30 * 60
export const STREAM_UPLOAD_EXPIRY_MS = 15 * 60 * 1000

// Keep the Stream implementation ready, but do not expose a paid upload path yet.
export const ENABLE_STREAM_VIDEO_UPLOAD = false

export const IMAGE_MIME_TO_EXTENSION: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
  'video/x-flv',
  'video/mpeg',
  'video/mp2t',
  'video/3gpp',
])

type FileMetadata = Pick<File, 'name' | 'size' | 'type'>

export class MediaUploadError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}

export function validateImageUpload(file: FileMetadata): void {
  if (!IMAGE_MIME_TO_EXTENSION[file.type]) {
    throw new MediaUploadError('仅支持 JPEG、PNG、GIF、WebP 或 AVIF 图片')
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new MediaUploadError('图片文件为空')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new MediaUploadError('图片不能超过 10 MB')
  }
}

export function validateVideoUpload(file: FileMetadata): void {
  if (!VIDEO_MIME_TYPES.has(file.type)) {
    throw new MediaUploadError('仅支持 MP4、WebM、MOV、MKV、AVI、FLV、MPEG、TS 或 3GP 视频')
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new MediaUploadError('视频文件为空')
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new MediaUploadError('视频不能超过 200 MB')
  }
}

export function createEditorObjectKey(file: FileMetadata, now = new Date(), id = crypto.randomUUID()): string {
  const extension = IMAGE_MIME_TO_EXTENSION[file.type]
  if (!extension) throw new MediaUploadError('不支持的图片格式')

  const base = slugifyFilename(file.name.replace(/\.[^.]+$/, ''))
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `editor/${year}/${month}/${base}-${id}.${extension}`
}

export function publicMediaUrl(siteBaseUrl: string, key: string): string {
  const base = new URL(siteBaseUrl)
  base.pathname = `${base.pathname.replace(/\/$/, '')}/${key}`.replace(/\/+/g, '/')
  base.search = ''
  base.hash = ''
  return base.toString()
}

export function buildImageMarkdoc(src: string, alt: string, caption = ''): string {
  const attrs = [`src=${quoteMarkdocAttribute(src)}`, `alt=${quoteMarkdocAttribute(alt)}`]
  if (caption.trim()) attrs.push(`caption=${quoteMarkdocAttribute(caption)}`)
  return `{% image ${attrs.join(' ')} /%}`
}

export function buildStreamVideoMarkdoc(uid: string, title = '', caption = ''): string {
  const attrs = [`uid=${quoteMarkdocAttribute(uid)}`]
  if (title.trim()) attrs.push(`title=${quoteMarkdocAttribute(title)}`)
  if (caption.trim()) attrs.push(`caption=${quoteMarkdocAttribute(caption)}`)
  return `{% streamVideo ${attrs.join(' ')} /%}`
}

export function isSafeEditorImageSource(src: string, siteBaseUrl?: string): boolean {
  try {
    const relativeOrigin = 'https://relative.invalid'
    const url = new URL(src, relativeOrigin)
    if (!url.pathname.startsWith('/editor/')) return false
    if (url.origin === relativeOrigin && src.startsWith('/') && !src.startsWith('//')) return true
    if (url.protocol !== 'https:' || !siteBaseUrl) return false
    return url.origin === new URL(siteBaseUrl).origin
  } catch {
    return false
  }
}

export function isStreamVideoUid(uid: string): boolean {
  // Stream video UIDs are 32-character hexadecimal IDs, not arbitrary URLs.
  return /^[a-f0-9]{32}$/i.test(uid)
}

export function isStreamCustomerCode(code: string): boolean {
  return /^[a-z0-9-]{1,128}$/i.test(code)
}

interface StreamEnv {
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_STREAM_API_TOKEN?: string
  SITE_BASE_URL?: string
}

interface StreamUploadInput {
  name: string
  size: number
  type: string
}

interface StreamDirectUploadResult {
  uploadURL: string
  uid: string
  expiresAt: string
}

interface StreamApiResponse {
  success?: boolean
  result?: { uploadURL?: string; uid?: string }
  errors?: Array<{ message?: string }>
}

export async function createStreamDirectUpload(
  input: StreamUploadInput,
  env: StreamEnv,
  requestOrigin: string,
  fetchFn: typeof fetch = fetch,
): Promise<StreamDirectUploadResult> {
  validateVideoUpload(input)

  const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const apiToken = env.CLOUDFLARE_STREAM_API_TOKEN?.trim()
  if (!accountId || !apiToken) {
    throw new MediaUploadError('Cloudflare Stream 尚未配置', 500)
  }

  const baseUrl = env.SITE_BASE_URL?.trim() || requestOrigin
  let allowedOrigin: string
  try {
    allowedOrigin = new URL(baseUrl).origin
  } catch {
    throw new MediaUploadError('SITE_BASE_URL 配置无效', 500)
  }

  const expiresAt = new Date(Date.now() + STREAM_UPLOAD_EXPIRY_MS).toISOString()
  let response: Response
  try {
    response = await fetchFn(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: STREAM_MAX_DURATION_SECONDS,
          expiry: expiresAt,
          requireSignedURLs: false,
          allowedOrigins: [allowedOrigin],
          meta: { name: input.name.slice(0, 200), mimeType: input.type },
        }),
      },
    )
  } catch {
    throw new MediaUploadError('无法连接 Cloudflare Stream', 502)
  }

  const payload = await response.json().catch(() => ({})) as StreamApiResponse
  const error = payload.errors?.[0]?.message
  const uploadURL = payload.result?.uploadURL
  const uid = payload.result?.uid
  if (!response.ok || !payload.success || !uploadURL || !isStreamVideoUid(uid ?? '')) {
    throw new MediaUploadError(error || 'Cloudflare Stream 未能创建上传链接', 502)
  }

  return { uploadURL, uid, expiresAt }
}

function slugifyFilename(name: string): string {
  return name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image'
}

function quoteMarkdocAttribute(value: string): string {
  const normalized = value.trim().replace(/[\r\n]+/g, ' ')
  return `"${normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}
