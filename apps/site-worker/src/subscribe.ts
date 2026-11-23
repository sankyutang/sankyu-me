/** Subscribe helpers for the public site-worker (D1-backed). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SubscribeResult =
  | { status: 200; body: { ok: true; status: 'created' | 'duplicate' } }
  | { status: 400; body: { ok: false; error: string } }
  | { status: 429; body: { ok: false; error: 'rate_limited' } }
  | { status: 503; body: { ok: false; error: 'unavailable' } }
  | { status: 500; body: { ok: false; error: 'server_error' } }

export function normalizeEmail(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().toLowerCase()
}

export function validateSubscribePayload(input: {
  email?: unknown
  website?: unknown
}): { ok: true; email: string } | { ok: false; error: string; honeypot?: boolean } {
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return { ok: false, error: 'honeypot', honeypot: true }
  }
  const email = normalizeEmail(input.email)
  if (!email) return { ok: false, error: 'missing_email' }
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, error: 'invalid_email' }
  return { ok: true, email }
}

export async function hashIp(ip: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${secret}|${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

export async function handleSubscribe(
  db: D1Database | undefined,
  request: Request,
  opts: { ipHashSecret: string } = { ipHashSecret: 'sankyu-subscribe' }
): Promise<SubscribeResult> {
  if (!db) return { status: 503, body: { ok: false, error: 'unavailable' } }

  let payload: { email?: unknown; website?: unknown } = {}
  const ctype = request.headers.get('content-type') || ''
  try {
    if (ctype.includes('application/json')) {
      payload = (await request.json()) as typeof payload
    } else if (ctype.includes('application/x-www-form-urlencoded') || ctype.includes('multipart/form-data')) {
      const form = await request.formData()
      payload = { email: form.get('email'), website: form.get('website') }
    } else {
      // try JSON first, then empty
      try {
        payload = (await request.json()) as typeof payload
      } catch {
        payload = {}
      }
    }
  } catch {
    return { status: 400, body: { ok: false, error: 'invalid_email' } }
  }

  const checked = validateSubscribePayload(payload)
  // Honeypot: pretend success, do not store.
  if (!checked.ok && checked.honeypot) {
    return { status: 200, body: { ok: true, status: 'created' } }
  }
  if (!checked.ok) {
    return { status: 400, body: { ok: false, error: checked.error } }
  }

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  const ipHash = await hashIp(ip, opts.ipHashSecret)
  const ua = (request.headers.get('user-agent') || '').slice(0, 240)

  try {
    const since = new Date(Date.now() - WINDOW_MS).toISOString()
    const recent = await db
      .prepare(
        'SELECT COUNT(*) AS c FROM subscribe_attempts WHERE ip_hash = ?1 AND created_at >= ?2'
      )
      .bind(ipHash, since)
      .first<{ c: number }>()
    if ((recent?.c ?? 0) >= MAX_ATTEMPTS) {
      return { status: 429, body: { ok: false, error: 'rate_limited' } }
    }

    await db
      .prepare('INSERT INTO subscribe_attempts (ip_hash) VALUES (?1)')
      .bind(ipHash)
      .run()

    const existing = await db
      .prepare('SELECT id FROM subscribers WHERE email = ?1')
      .bind(checked.email)
      .first<{ id: number }>()

    if (existing) {
      await db
        .prepare('UPDATE subscribers SET updated_at = CURRENT_TIMESTAMP, ip_hash = ?1, user_agent = ?2 WHERE id = ?3')
        .bind(ipHash, ua, existing.id)
        .run()
      return { status: 200, body: { ok: true, status: 'duplicate' } }
    }

    await db
      .prepare(
        'INSERT INTO subscribers (email, source, ip_hash, user_agent) VALUES (?1, ?2, ?3, ?4)'
      )
      .bind(checked.email, 'footer', ipHash, ua)
      .run()

    return { status: 200, body: { ok: true, status: 'created' } }
  } catch (err) {
    const msg = (err as Error).message || ''
    // Missing table → treat as unavailable (migration not applied yet)
    if (/no such table/i.test(msg)) {
      return { status: 503, body: { ok: false, error: 'unavailable' } }
    }
    if (/UNIQUE/i.test(msg)) {
      return { status: 200, body: { ok: true, status: 'duplicate' } }
    }
    return { status: 500, body: { ok: false, error: 'server_error' } }
  }
}
