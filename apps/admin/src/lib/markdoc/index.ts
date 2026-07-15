import Markdoc from '@markdoc/markdoc'
import {
  isSafeEditorImageSource,
  isStreamCustomerCode,
  isStreamVideoUid,
} from '@/lib/media'

interface RenderMarkdocOptions {
  siteBaseUrl?: string
  streamCustomerCode?: string
}

function textAttribute(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function createConfig({ siteBaseUrl, streamCustomerCode }: RenderMarkdocOptions): Markdoc.Config {
  return {
    nodes: {},
    tags: {
      image: {
        selfClosing: true,
        attributes: {
          src: { type: String, required: true },
          alt: { type: String, required: true },
          caption: { type: String },
        },
        transform(node) {
          const src = textAttribute(node.attributes.src)
          const alt = textAttribute(node.attributes.alt)
          const caption = textAttribute(node.attributes.caption)
          if (!isSafeEditorImageSource(src, siteBaseUrl)) return []

          const children: Markdoc.Tag[] = [
            new Markdoc.Tag('img', {
              src,
              alt,
              loading: 'lazy',
              decoding: 'async',
            }),
          ]
          if (caption) children.push(new Markdoc.Tag('figcaption', { class: 'content-media-caption' }, [caption]))
          return new Markdoc.Tag('figure', { class: 'content-media content-image' }, children)
        },
      },
      streamVideo: {
        selfClosing: true,
        attributes: {
          uid: { type: String, required: true },
          title: { type: String },
          caption: { type: String },
        },
        transform(node) {
          const uid = textAttribute(node.attributes.uid)
          const title = textAttribute(node.attributes.title) || '视频播放器'
          const caption = textAttribute(node.attributes.caption)
          if (!streamCustomerCode || !isStreamCustomerCode(streamCustomerCode) || !isStreamVideoUid(uid)) return []

          const player = new Markdoc.Tag('iframe', {
            class: 'content-stream-frame',
            src: `https://customer-${streamCustomerCode}.cloudflarestream.com/${uid}/iframe`,
            title,
            allow: 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture',
            allowfullscreen: 'true',
            loading: 'lazy',
          })
          const children: Markdoc.Tag[] = [
            new Markdoc.Tag('div', { class: 'content-stream-player' }, [player]),
          ]
          if (caption) children.push(new Markdoc.Tag('figcaption', { class: 'content-media-caption' }, [caption]))
          return new Markdoc.Tag('figure', { class: 'content-media content-stream-video' }, children)
        },
      },
    },
  }
}

export function renderMarkdoc(source: string, options: RenderMarkdocOptions = {}): string {
  if (!source) return ''
  const ast = Markdoc.parse(source)
  const transformed = Markdoc.transform(ast, createConfig(options))
  return Markdoc.renderers.html(transformed)
}
