import { SCHEMAS, slugify } from './schemas'
import type { Collection } from '../db/types'

/**
 * Coerce a JSON body from the admin form into the shape expected by D1 columns.
 * - checkbox -> 0/1 INTEGER
 * - number -> Number
 * - datetime -> ISO string
 * - json -> stringified JSON (validated)
 * Drops keys not defined in the schema.
 */
export function coerceFormBody(collection: Collection, body: Record<string, unknown>) {
  const schema = SCHEMAS[collection]
  if (!schema) throw new Error(`Unknown collection: ${collection}`)
  const out: Record<string, unknown> = {}
  for (const f of schema.fields) {
    if (!(f.key in body)) continue
    const raw = body[f.key]
    if (raw === '' || raw === null || raw === undefined) {
      out[f.key] = f.type === 'checkbox' ? 0 : null
      if (f.type === 'json') out[f.key] = JSON.stringify(parseDefault(f.defaultValue ?? '[]'))
      if (f.type === 'number') out[f.key] = null
      continue
    }
    switch (f.type) {
      case 'checkbox':
        out[f.key] = raw === 1 || raw === '1' || raw === true || raw === 'on' ? 1 : 0
        break
      case 'number':
        out[f.key] = Number(raw)
        break
      case 'datetime': {
        const d = new Date(String(raw))
        out[f.key] = isNaN(d.getTime()) ? null : d.toISOString()
        break
      }
      case 'json':
        // validate
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
          out[f.key] = JSON.stringify(parsed)
        } catch {
          throw new Error(`字段 ${f.label} JSON 格式错误`)
        }
        break
      default:
        out[f.key] = String(raw)
    }
  }
  // slug fallback
  if (!out.slug && schema.slugFrom && body[schema.slugFrom]) {
    out.slug = slugify(String(body[schema.slugFrom]))
  }
  return out
}

function parseDefault(s: any) {
  try { return typeof s === 'string' ? JSON.parse(s) : s } catch { return [] }
}
