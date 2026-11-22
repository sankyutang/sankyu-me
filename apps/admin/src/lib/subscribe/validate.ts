/** Shared subscribe validation (admin tests + site-worker). No network I/O. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SubscribeValidation =
  | { ok: true; email: string }
  | { ok: false; error: 'invalid_email' | 'honeypot' | 'missing_email' }

export function normalizeEmail(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().toLowerCase()
}

export function validateSubscribeInput(input: {
  email?: unknown
  website?: unknown // honeypot — must stay empty
}): SubscribeValidation {
  // Honeypot filled ⇒ treat as soft success path at API layer; here flag it.
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return { ok: false, error: 'honeypot' }
  }
  const email = normalizeEmail(input.email)
  if (!email) return { ok: false, error: 'missing_email' }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'invalid_email' }
  }
  return { ok: true, email }
}
