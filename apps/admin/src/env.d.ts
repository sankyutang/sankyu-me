/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>

interface Env {
  DB: D1Database
  SITE_BUCKET: R2Bucket
  SITE_BASE_URL: string
  ASSET_BASE_URL: string
  CLOUDFLARE_API_TOKEN?: string
  CLOUDFLARE_ZONE_ID?: string
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_STREAM_API_TOKEN?: string
  CLOUDFLARE_STREAM_CUSTOMER_CODE?: string
}

declare namespace App {
  interface Locals extends Runtime {}
}
