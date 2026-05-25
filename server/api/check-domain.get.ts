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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const raw = String(query.domain ?? '')
    .trim()
    .toLowerCase()
  const type = query.type === 'CUSTOM' ? 'CUSTOM' : 'SUBDOMAIN'

  if (!raw) return { ok: false as const, reason: 'empty' as Reason }

  if (type === 'SUBDOMAIN') {
    if (raw.length < 3) return { ok: false as const, reason: 'tooShort' as Reason }
    if (!SUBDOMAIN_RE.test(raw)) return { ok: false as const, reason: 'invalid' as Reason }
    if (RESERVED.has(raw)) return { ok: false as const, reason: 'reserved' as Reason }
    const fullDomain = `${raw}.topiqu.com`
    if (await isDomainTaken(fullDomain)) return { ok: false as const, reason: 'taken' as Reason }
    return { ok: true as const, fullDomain }
  }

  if (!CUSTOM_DOMAIN_RE.test(raw)) return { ok: false as const, reason: 'invalid' as Reason }
  if (raw.endsWith('.topiqu.com')) return { ok: false as const, reason: 'reserved' as Reason }
  if (await isDomainTaken(raw)) return { ok: false as const, reason: 'taken' as Reason }
  return { ok: true as const, fullDomain: raw }
})

async function isDomainTaken(domain: string): Promise<boolean> {
  const platformUrl = (useRuntimeConfig() as any).platformApiUrl
  if (!platformUrl) return false
  try {
    const res = await $fetch<{ taken: boolean }>(`${platformUrl}/api/domains/check`, {
      query: { domain },
    })
    return res.taken === true
  } catch {
    return false
  }
}
