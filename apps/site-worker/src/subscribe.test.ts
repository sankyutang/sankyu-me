import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { handleSubscribe, validateSubscribePayload } from './subscribe'

describe('validateSubscribePayload', () => {
  it('accepts a normal email', () => {
    const r = validateSubscribePayload({ email: '  You@Example.COM ' })
    assert.deepEqual(r, { ok: true, email: 'you@example.com' })
  })

  it('rejects missing / invalid email', () => {
    assert.equal(validateSubscribePayload({ email: '' }).ok, false)
    assert.equal(validateSubscribePayload({ email: 'not-an-email' }).ok, false)
  })

  it('flags honeypot', () => {
    const r = validateSubscribePayload({ email: 'a@b.co', website: 'http://spam' })
    assert.equal(r.ok, false)
    if (!r.ok) assert.equal(r.honeypot, true)
  })
})

type Row = Record<string, unknown>

/** Tiny in-memory D1 stand-in for subscribe flow tests. */
function mockDb(opts: { failTable?: boolean; existing?: string[] } = {}) {
  const emails = new Set((opts.existing || []).map((e) => e.toLowerCase()))
  const attempts: { ip_hash: string; created_at: string }[] = []
  const prepare = (sql: string) => {
    const binds: unknown[] = []
    const api = {
      bind(...args: unknown[]) {
        binds.push(...args)
        return api
      },
      async first<T extends Row>() {
        if (opts.failTable) throw new Error('no such table: subscribers')
        if (/SELECT COUNT\(\*\)/.test(sql)) {
          const ip = String(binds[0])
          const since = String(binds[1])
          const c = attempts.filter((a) => a.ip_hash === ip && a.created_at >= since).length
          return { c } as unknown as T
        }
        if (/SELECT id FROM subscribers/.test(sql)) {
          const email = String(binds[0])
          if (!emails.has(email)) return null
          return { id: 1 } as unknown as T
        }
        return null
      },
      async run() {
        if (opts.failTable) throw new Error('no such table: subscribers')
        if (/INSERT INTO subscribe_attempts/.test(sql)) {
          attempts.push({ ip_hash: String(binds[0]), created_at: new Date().toISOString() })
          return { success: true }
        }
        if (/INSERT INTO subscribers/.test(sql)) {
          const email = String(binds[0])
          if (emails.has(email)) throw new Error('UNIQUE constraint failed')
          emails.add(email)
          return { success: true }
        }
        if (/UPDATE subscribers/.test(sql)) return { success: true }
        return { success: true }
      },
    }
    return api
  }
  return {
    prepare,
    _emails: emails,
    _attempts: attempts,
  } as unknown as D1Database & { _emails: Set<string>; _attempts: unknown[] }
}

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://sankyu.me/api/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4', ...headers },
    body: JSON.stringify(body),
  })
}

describe('handleSubscribe', () => {
  it('stores a new email', async () => {
    const db = mockDb()
    const result = await handleSubscribe(db, req({ email: 'new@example.com' }))
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, { ok: true, status: 'created' })
    assert.ok((db as unknown as { _emails: Set<string> })._emails.has('new@example.com'))
  })

  it('returns duplicate for existing email', async () => {
    const db = mockDb({ existing: ['dup@example.com'] })
    const result = await handleSubscribe(db, req({ email: 'dup@example.com' }))
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, { ok: true, status: 'duplicate' })
  })

  it('rejects invalid email', async () => {
    const db = mockDb()
    const result = await handleSubscribe(db, req({ email: 'nope' }))
    assert.equal(result.status, 400)
    assert.equal(result.body.ok, false)
  })

  it('honeypot looks successful but does not store', async () => {
    const db = mockDb()
    const result = await handleSubscribe(db, req({ email: 'bot@x.com', website: 'spam' }))
    assert.equal(result.status, 200)
    assert.equal((db as unknown as { _emails: Set<string> })._emails.has('bot@x.com'), false)
  })

  it('returns unavailable when DB missing or table missing', async () => {
    const noDb = await handleSubscribe(undefined, req({ email: 'a@b.co' }))
    assert.equal(noDb.status, 503)
    const db = mockDb({ failTable: true })
    const missing = await handleSubscribe(db, req({ email: 'a@b.co' }))
    assert.equal(missing.status, 503)
  })

  it('rate-limits repeated attempts from same IP', async () => {
    const db = mockDb()
    for (let i = 0; i < 8; i++) {
      const r = await handleSubscribe(db, req({ email: `u${i}@ex.com` }))
      assert.equal(r.status, 200)
    }
    const blocked = await handleSubscribe(db, req({ email: 'more@ex.com' }))
    assert.equal(blocked.status, 429)
  })
})
