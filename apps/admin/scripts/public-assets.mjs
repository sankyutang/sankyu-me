import { readdir } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { spawn } from 'node:child_process'

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

const MIME_TYPES = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function extensionFor(file) {
  const dot = file.lastIndexOf('.')
  return dot === -1 ? '' : file.slice(dot).toLowerCase()
}

export function contentTypeForAsset(file) {
  return MIME_TYPES[extensionFor(file)] ?? 'application/octet-stream'
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(target))
    else if (entry.isFile() && !entry.name.startsWith('.')) files.push(target)
  }
  return files
}

export async function listPublicAssets(distDirectory) {
  const assetsDirectory = resolve(distDirectory, '_astro')
  const files = await walk(assetsDirectory)
  return files
    .map((file) => ({
      file,
      key: `_astro/${relative(assetsDirectory, file).split(sep).join('/')}`,
      contentType: contentTypeForAsset(file),
    }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

export function uploadArgs(asset, bucket) {
  return [
    '--no-install',
    'wrangler',
    'r2',
    'object',
    'put',
    `${bucket}/${asset.key}`,
    '--file',
    asset.file,
    '--content-type',
    asset.contentType,
    '--cache-control',
    CACHE_CONTROL,
  ]
}

export function run(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.once('error', rejectRun)
    child.once('exit', (code) => {
      if (code === 0) resolveRun()
      else rejectRun(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`))
    })
  })
}

export async function syncPublicAssets({ distDirectory, bucket, execute = run }) {
  const assets = await listPublicAssets(distDirectory)
  if (assets.length === 0) throw new Error(`No public assets found in ${resolve(distDirectory, '_astro')}`)

  for (const asset of assets) {
    await execute('npx', uploadArgs(asset, bucket))
  }
  return assets
}

async function main() {
  const distDirectory = process.env.ADMIN_DIST_DIRECTORY ?? resolve('dist')
  const bucket = process.env.SITE_BUCKET_NAME ?? 'sankyume-site'
  const assets = await syncPublicAssets({ distDirectory, bucket })
  console.log(`Synced ${assets.length} immutable public assets to ${bucket}.`)
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
