import { setTimeout as delay } from 'node:timers/promises'

const baseUrl = process.env.PRODUCTION_TEST_URL || 'http://127.0.0.1:3000'
const headers = { Accept: 'text/html' }
const deadline = Date.now() + 30_000
let ready = false

while (Date.now() < deadline) {
  const response = await fetch(new URL('/en', baseUrl), {
    headers,
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null)
  if (response?.ok) {
    ready = true
    break
  }
  await delay(250)
}

if (!ready) throw new Error(`Production server did not become ready at ${baseUrl}`)

const failures: string[] = []
const checkPage = async (path: string, status = 200, marker?: string) => {
  const response = await fetch(new URL(path, baseUrl), { headers, signal: AbortSignal.timeout(10_000) })
  const html = await response.text()
  if (response.status !== status) {
    failures.push(`${path}: expected HTTP ${status}, received ${response.status}`)
  } else if (marker && !html.includes(marker)) {
    failures.push(`${path}: missing server-rendered content (${marker})`)
  } else {
    console.log(`${response.status} ${path}`)
  }
}

for (const locale of ['en', 'cs']) {
  await checkPage(`/${locale}`, 200, 'id="hero-title"')
  await checkPage(`/${locale}/docs`)
  await checkPage(`/${locale}/docs/authentication`, 200, 'x-api-key')
  await checkPage(`/${locale}/changelog`)
  await checkPage(`/${locale}/changelog/2026-10-02-shopify-and-publication-channels`, 200, 'docs-prose')

  const steps =
    locale === 'cs'
      ? ['web', 'design', 'plan', 'ucet', 'overeni', 'prehled']
      : ['site', 'design', 'plan', 'account', 'verify', 'summary']
  for (const step of steps) await checkPage(`/${locale}/onboarding/${step}`, 200, 'id="onboarding-title"')
}
await checkPage('/en/production-smoke-missing-page', 404)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('Production rendering is healthy in both locales.')
