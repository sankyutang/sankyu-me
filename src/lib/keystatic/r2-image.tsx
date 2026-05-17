import React from 'react'
import { fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import { toastQueue } from '@keystar/ui/toast'

type UploadResponse = {
  src: string
  width?: number
  height?: number
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/avif',
])

async function uploadR2Image(file: File): Promise<UploadResponse> {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('仅支持 PNG、JPEG、GIF、WebP 和 AVIF 图片')
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('图片大小不能超过 10MB')
  }

  const dimensions = await getImageDimensions(file)

  const formData = new FormData()
  formData.set('file', file, file.name)

  const response = await fetch('/api/uploads/r2', {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload || typeof payload.src !== 'string') {
    throw new Error(payload?.error || '上传到 R2 失败')
  }

  return {
    src: payload.src,
    width: dimensions.width,
    height: dimensions.height,
  }
}

async function getImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({
        width: image.naturalWidth || undefined,
        height: image.naturalHeight || undefined,
      })
      URL.revokeObjectURL(objectUrl)
    }

    image.onerror = () => {
      resolve({})
      URL.revokeObjectURL(objectUrl)
    }

    image.src = objectUrl
  })
}

export const r2Image = block({
  label: 'R2 图片',
  description: '拖拽或粘贴图片后自动上传到 Cloudflare R2。',
  schema: {
    src: fields.url({ label: '图片地址' }),
    alt: fields.text({ label: 'Alt 文本', defaultValue: '' }),
    width: fields.integer({ label: '宽度' }),
    height: fields.integer({ label: '高度' }),
  },
  ContentView: ({ value }) => {
    if (!value.src) {
      return React.createElement(
        'div',
        {
          style: {
            border: '1px dashed var(--ks-colors-border-neutral)',
            borderRadius: '12px',
            padding: '16px',
            color: 'var(--ks-colors-foreground-neutral-secondary)',
          },
        },
        '拖拽或粘贴图片以上传到 R2'
      )
    }

    return React.createElement('img', {
      src: value.src,
      alt: value.alt,
      width: value.width ?? undefined,
      height: value.height ?? undefined,
      style: {
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
      },
    })
  },
  handleFile: async (file) => {
    try {
      toastQueue.info('正在上传到 R2…')
      const image = await uploadR2Image(file)
      toastQueue.positive('图片已上传到 R2')

      return {
        ...image,
        alt: '',
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '上传到 R2 失败'
      toastQueue.critical(message)
      return false
    }
  },
})

export const markdocComponents = {
  r2Image,
}

export const markdocRenderConfig = fields.markdoc.createMarkdocConfig({
  components: markdocComponents,
  render: {
    tags: {
      r2Image: 'img',
    },
  },
})
