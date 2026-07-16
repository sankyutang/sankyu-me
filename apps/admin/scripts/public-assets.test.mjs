import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { contentTypeForAsset, listPublicAssets, syncPublicAssets, uploadArgs } from './public-assets.mjs'
import { stylesheetsFromHtml, verifyPublicCss } from './verify-public-css.mjs'

test('lists _astro files with R2 keys and MIME types', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'sankyume-assets-'))
  await mkdir(join(dist, '_astro', 'nested'), { recursive: true })
  await writeFile(join(dist, '_astro', 'site.css'), 'body {}')
  await writeFile(join(dist, '_astro', 'nested', 'site.js'), 'export {}')

  const assets = await listPublicAssets(dist)
  assert.deepEqual(assets.map(({ key, contentType }) => ({ key, contentType })), [
    { key: '_astro/nested/site.js', contentType: 'application/javascript; charset=utf-8' },
    { key: '_astro/site.css', contentType: 'text/css; charset=utf-8' },
  ])
  assert.equal(contentTypeForAsset('unknown.bin'), 'application/octet-stream')
})

test('uploads immutable R2 objects without deleting old assets', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'sankyume-assets-'))
  await mkdir(join(dist, '_astro'), { recursive: true })
  const css = join(dist, '_astro', 'site.css')
  await writeFile(css, 'body {}')
  const calls = []

  await syncPublicAssets({
    distDirectory: dist,
    bucket: 'site-bucket',
    execute: async (command, args) => calls.push({ command, args }),
  })

  assert.equal(calls.length, 1)
  assert.equal(calls[0].command, 'npx')
  assert.deepEqual(calls[0].args, uploadArgs({ file: css, key: '_astro/site.css', contentType: 'text/css; charset=utf-8' }, 'site-bucket'))
  assert.ok(calls[0].args.includes('--cache-control'))
})

test('finds and verifies only controlled Astro stylesheet URLs', async () => {
  const pageUrl = new URL('https://sankyu.me/blog/example/')
  const html = '<link rel="stylesheet" href="/_astro/site.css"><link rel="stylesheet" href="https://example.com/else.css">'
  assert.deepEqual(stylesheetsFromHtml(html, pageUrl).map(String), ['https://sankyu.me/_astro/site.css'])

  const responses = new Map([
    ['https://sankyu.me/blog/example/', new Response(html, { status: 200 })],
    ['https://sankyu.me/_astro/site.css', new Response('body {}', { status: 200, headers: { 'content-type': 'text/css; charset=utf-8' } })],
  ])
  const verified = await verifyPublicCss({
    siteBaseUrl: 'https://sankyu.me',
    paths: ['/blog/example/'],
    fetchImpl: async (url) => responses.get(String(url)),
  })
  assert.deepEqual(verified, ['https://sankyu.me/_astro/site.css'])
})
