// R2 put/delete via the workers binding (no S3 signing needed in-runtime).

export interface PutOptions {
  contentType: string
  cacheControl?: string
}

export async function putObject(
  bucket: R2Bucket,
  key: string,
  body: string | ArrayBuffer | Uint8Array,
  opts: PutOptions
) {
  await bucket.put(key, body, {
    httpMetadata: {
      contentType: opts.contentType,
      cacheControl: opts.cacheControl ?? 'public, max-age=60, s-maxage=3600',
    },
  })
}

export async function deleteObject(bucket: R2Bucket, key: string) {
  await bucket.delete(key)
}

// Hash an HTML body for the publish_log content_hash column.
export async function hashBody(body: string): Promise<string> {
  const data = new TextEncoder().encode(body)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
