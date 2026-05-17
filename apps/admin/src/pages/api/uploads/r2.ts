import type { APIRoute } from 'astro'

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function slugifyFilename(name: string) {
  return name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image'
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return new Response('missing file', { status: 400 })

  const ext = MIME_TO_EXT[file.type] || (file.name.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase() ?? 'bin')
  const base = slugifyFilename(file.name.replace(/\.[^.]+$/, ''))
  const now = new Date()
  const key = `editor/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${base}-${crypto.randomUUID()}.${ext}`

  const body = new Uint8Array(await file.arrayBuffer())
  await env.SITE_BUCKET.put(key, body, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream',
      cacheControl: 'public, max-age=31536000, immutable',
    },
  })

  const base_url = (env.ASSET_BASE_URL || env.SITE_BASE_URL || '').replace(/\/$/, '')
  const src = `${base_url}/${key}`
  return Response.json({ key, src })
}
