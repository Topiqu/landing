import type { H3Event } from 'h3'

import { onboardingLog } from '~~/server/utils/onboardingLog'

const RESERVED = new Set([
  'www',
  'api',
  'admin',
  'app',
  'mail',
  'cdn',
  'static',
  'help',
  'support',
  'docs',
  'auth',
  'login',
  'logout',
  'register',
  'master',
  'topiqu',
  'status',
  'dashboard',
  'billing',
])

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/
const CUSTOM_DOMAIN_RE = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/

type Reason = 'empty' | 'tooShort' | 'invalid' | 'reserved' | 'taken'
type Result = { ok: true; fullDomain: string } | { ok: false; reason: Reason }

export default defineEventHandler(async (event): Promise<Result> => {
  const query = getQuery(event)
  const raw = String(query.domain ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '')
  const type = query.type === 'CUSTOM' ? 'CUSTOM' : 'SUBDOMAIN'

  if (!raw) return { ok: false, reason: 'empty' }

  // Format is checked here so typing gets instant feedback; availability is the platform's call.
  if (type === 'SUBDOMAIN') {
    if (raw.length < 3) return { ok: false, reason: 'tooShort' }
    if (!SUBDOMAIN_RE.test(raw)) return { ok: false, reason: 'invalid' }
    if (RESERVED.has(raw)) return { ok: false, reason: 'reserved' }
  } else {
    if (raw.length > 253 || !CUSTOM_DOMAIN_RE.test(raw)) return { ok: false, reason: 'invalid' }
    if (raw === 'topiqu.com' || raw.endsWith('.topiqu.com')) return { ok: false, reason: 'reserved' }
  }

  return platformDomainCheck(event, raw, type)
})

// Availability must be confirmed by the platform; syntax validation is not an availability check.
async function platformDomainCheck(event: H3Event, domain: string, type: 'SUBDOMAIN' | 'CUSTOM'): Promise<Result> {
  const platformUrl = (useRuntimeConfig(event) as any).platformApiUrl
  const startedAt = performance.now()
  let outcome = platformUrl ? 'request_failed' : 'not_configured'
  try {
    if (!platformUrl) throw new Error('Platform not configured')
    const result = await $fetch<Result>(`${platformUrl}/api/onboarding/check-domain`, {
      query: { domain, type },
      timeout: 5000,
      retry: 0,
    })
    if (result?.ok === true && typeof result.fullDomain === 'string') return result
    if (result?.ok === false && ['empty', 'tooShort', 'invalid', 'reserved', 'taken'].includes(result.reason))
      return result
    outcome = 'invalid_response'
    throw new Error('Invalid availability response')
  } catch (error: any) {
    const upstreamStatus = error?.response?.status ?? error?.statusCode
    onboardingLog(event, 'domain_check.failed', {
      dependency: 'platform',
      status: 503,
      durationMs: Math.round(performance.now() - startedAt),
      outcome: typeof upstreamStatus === 'number' ? 'upstream_http_error' : outcome,
      ...(typeof upstreamStatus === 'number' ? { upstreamStatus } : {}),
    })
    throw createError({
      statusCode: 503,
      message: 'Domain availability could not be checked.',
      data: { reason: 'unavailable' },
    })
  }
}
