import Markdoc from '@markdoc/markdoc'

// Minimal Markdoc renderer for D1-stored content_markdoc TEXT.
// No custom nodes / tags yet — extend `config` here when needed (e.g. r2Image).
const config: Markdoc.Config = {
  nodes: {},
  tags: {},
}

export function renderMarkdoc(source: string): string {
  if (!source) return ''
  const ast = Markdoc.parse(source)
  const transformed = Markdoc.transform(ast, config)
  return Markdoc.renderers.html(transformed)
}
