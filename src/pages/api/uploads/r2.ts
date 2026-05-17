import type { APIRoute } from 'astro'
import { uploadImageToR2 } from '../../../lib/r2'

export const prerender = false

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const POST: APIRoute = async (context) => {
  const origin = context.request.headers.get('origin')
  const requestOrigin = new URL(context.request.url).origin

  if (origin && origin !== requestOrigin) {
    return json({ error: '非法来源' }, 403)
  }

  const formData = await context.request.formData()
  const file = formData.get('file') ?? formData.get('image')

  if (!(file instanceof File)) {
    return json({ error: '未找到上传文件' }, 400)
  }

  if (!file.type.startsWith('image/')) {
    return json({ error: '仅支持图片上传' }, 400)
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return json({ error: '图片大小不能超过 10MB' }, 400)
  }

  try {
    const uploaded = await uploadImageToR2(file, context)
    return json(uploaded)
  } catch (error) {
    const message = error instanceof Error ? error.message : '上传失败'
    return json({ error: message }, 500)
  }
}
