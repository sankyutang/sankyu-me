import type { APIRoute } from 'astro'
import { createStreamDirectUpload, ENABLE_STREAM_VIDEO_UPLOAD, MediaUploadError } from '@/lib/media'

export const POST: APIRoute = async ({ request, locals }) => {
  if (!ENABLE_STREAM_VIDEO_UPLOAD) {
    return Response.json({ error: '视频上传暂未开放' }, { status: 503 })
  }

  let body: { name?: unknown; size?: unknown; type?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: '请求必须是 JSON' }, { status: 400 })
  }

  if (typeof body.name !== 'string' || typeof body.size !== 'number' || typeof body.type !== 'string') {
    return Response.json({ error: '视频信息无效' }, { status: 400 })
  }

  try {
    const upload = await createStreamDirectUpload(
      { name: body.name, size: body.size, type: body.type },
      locals.runtime.env,
      new URL(request.url).origin,
    )
    return Response.json(upload, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const message = error instanceof MediaUploadError ? error.message : '无法创建视频上传链接'
    const status = error instanceof MediaUploadError ? error.status : 500
    return Response.json({ error: message }, { status })
  }
}
