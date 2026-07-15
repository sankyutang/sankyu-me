import type { APIRoute } from 'astro'
import {
  createEditorObjectKey,
  MediaUploadError,
  publicMediaUrl,
  validateImageUpload,
} from '@/lib/media'

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return new Response('missing file', { status: 400 })

  try {
    validateImageUpload(file)
  } catch (error) {
    const message = error instanceof MediaUploadError ? error.message : '图片校验失败'
    return Response.json({ error: message }, { status: 400 })
  }

  const key = createEditorObjectKey(file)
  const body = new Uint8Array(await file.arrayBuffer())
  try {
    await env.SITE_BUCKET.put(key, body, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return Response.json({ error: '图片写入 R2 失败' }, { status: 502 })
  }

  const siteBaseUrl = env.SITE_BASE_URL || new URL(request.url).origin
  const src = publicMediaUrl(siteBaseUrl, key)
  return Response.json({ key, src })
}
