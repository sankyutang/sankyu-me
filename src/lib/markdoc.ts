import Markdoc from '@markdoc/markdoc'
import { markdocRenderConfig } from './keystatic/r2-image'

export function renderMarkdocToHtml(node: unknown) {
  return Markdoc.renderers.html(Markdoc.transform(node as Markdoc.Node, markdocRenderConfig))
}
