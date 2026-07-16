import { verifyPublicCss } from './verify-public-css.mjs'

function requiredEnvironment(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required to call the Access-protected republish endpoint`)
  return value
}

export async function republishAndVerify({ fetchImpl = fetch } = {}) {
  const republishUrl = process.env.ADMIN_REPUBLISH_URL ?? 'https://admin.sankyu.me/api/republish'
  const response = await fetchImpl(republishUrl, {
    method: 'POST',
    headers: {
      'CF-Access-Client-Id': requiredEnvironment('CF_ACCESS_CLIENT_ID'),
      'CF-Access-Client-Secret': requiredEnvironment('CF_ACCESS_CLIENT_SECRET'),
    },
  })
  const body = await response.text()
  if (!response.ok) throw new Error(`Republish request returned ${response.status}: ${body.slice(0, 500)}`)

  let report
  try {
    report = JSON.parse(body)
  } catch {
    throw new Error('Republish endpoint returned non-JSON data')
  }
  if (!report.ok || report.report?.failed?.length) {
    throw new Error(`Republish failed: ${JSON.stringify(report.report?.failed ?? report)}`)
  }

  const paths = (process.env.PUBLIC_VERIFY_PATHS ?? '/,/blog/,/blog/travel-in-Hokkaido-japan')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean)
  return verifyPublicCss({
    siteBaseUrl: process.env.SITE_BASE_URL ?? 'https://sankyu.me',
    paths,
    fetchImpl,
  })
}

republishAndVerify().then(
  (stylesheets) => console.log(`Republished site and verified ${stylesheets.length} stylesheet(s).`),
  (error) => {
    console.error(error)
    process.exitCode = 1
  },
)
