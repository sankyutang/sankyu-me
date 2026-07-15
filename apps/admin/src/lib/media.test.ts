import assert from 'node:assert/strict'
import test from 'node:test'
import { renderMarkdoc } from './markdoc'
import {
  createEditorObjectKey,
  createStreamDirectUpload,
  ENABLE_STREAM_VIDEO_UPLOAD,
  MAX_IMAGE_BYTES,
  MediaUploadError,
  publicMediaUrl,
  validateImageUpload,
  validateVideoUpload,
} from './media'

test('creates a public URL that matches the R2 editor object key', () => {
  const key = createEditorObjectKey(
    { name: 'A Photo.png', type: 'image/png', size: 1 },
    new Date('2026-07-15T00:00:00Z'),
    'fixed-id',
  )

  assert.equal(key, 'editor/2026/07/a-photo-fixed-id.png')
  assert.equal(publicMediaUrl('https://sankyu.me', key), 'https://sankyu.me/editor/2026/07/a-photo-fixed-id.png')
})

test('keeps Stream upload disabled until the paid service is enabled', () => {
  assert.equal(ENABLE_STREAM_VIDEO_UPLOAD, false)
})

test('rejects unsupported and oversized image/video uploads', () => {
  assert.throws(
    () => validateImageUpload({ name: 'unsafe.svg', type: 'image/svg+xml', size: 1 }),
    MediaUploadError,
  )
  assert.throws(
    () => validateImageUpload({ name: 'large.png', type: 'image/png', size: MAX_IMAGE_BYTES + 1 }),
    MediaUploadError,
  )
  assert.throws(
    () => validateVideoUpload({ name: 'not-a-video.txt', type: 'text/plain', size: 1 }),
    MediaUploadError,
  )
})

test('renders only validated body-media tags', () => {
  const html = renderMarkdoc(
    '{% image src="https://sankyu.me/editor/2026/a.png" alt="A & B" caption="Caption" /%}\n{% streamVideo uid="f65014bc6ff5419ea86e7972a047ba22" title="Demo" /%}',
    { siteBaseUrl: 'https://sankyu.me', streamCustomerCode: 'abc123' },
  )

  assert.match(html, /content-image/)
  assert.match(html, /A &amp; B/)
  assert.match(html, /customer-abc123\.cloudflarestream\.com/)
  assert.doesNotMatch(
    renderMarkdoc('{% image src="//evil.example/editor/a.png" alt="Bad" /%}\n{% streamVideo uid="https://evil.example" /%}', {
      siteBaseUrl: 'https://sankyu.me',
      streamCustomerCode: 'abc123',
    }),
    /content-media|iframe/,
  )
})

test('creates a constrained Stream direct-upload URL', async () => {
  const upload = await createStreamDirectUpload(
    { name: 'demo.mp4', size: 1, type: 'video/mp4' },
    {
      CLOUDFLARE_ACCOUNT_ID: 'account-id',
      CLOUDFLARE_STREAM_API_TOKEN: 'token',
      SITE_BASE_URL: 'https://sankyu.me',
    },
    'http://localhost:4321',
    async (input, init) => {
      assert.equal(String(input), 'https://api.cloudflare.com/client/v4/accounts/account-id/stream/direct_upload')
      const body = JSON.parse(String(init?.body))
      assert.equal(body.maxDurationSeconds, 1800)
      assert.deepEqual(body.allowedOrigins, ['https://sankyu.me'])
      assert.equal(body.requireSignedURLs, false)
      return Response.json({
        success: true,
        result: { uploadURL: 'https://upload.videodelivery.net/one-time', uid: 'f65014bc6ff5419ea86e7972a047ba22' },
      })
    },
  )

  assert.equal(upload.uid, 'f65014bc6ff5419ea86e7972a047ba22')
})

test('reports missing Stream configuration and Cloudflare API failures', async () => {
  await assert.rejects(
    createStreamDirectUpload(
      { name: 'demo.mp4', size: 1, type: 'video/mp4' },
      {},
      'http://localhost:4321',
    ),
    (error: unknown) => error instanceof MediaUploadError && error.status === 500,
  )
  await assert.rejects(
    createStreamDirectUpload(
      { name: 'demo.mp4', size: 1, type: 'video/mp4' },
      { CLOUDFLARE_ACCOUNT_ID: 'account-id', CLOUDFLARE_STREAM_API_TOKEN: 'token' },
      'http://localhost:4321',
      async () => Response.json({ success: false, errors: [{ message: 'quota exhausted' }] }, { status: 429 }),
    ),
    (error: unknown) => error instanceof MediaUploadError && error.status === 502 && error.message === 'quota exhausted',
  )
})
