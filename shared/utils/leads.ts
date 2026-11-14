export const LEAD_SOURCES = ['hero', 'closing'] as const
export type LeadSource = (typeof LEAD_SOURCES)[number]

// Campaign parameters a landing URL may carry; `ref` tags personal outreach links.
export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'] as const
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]
export type Attribution = Partial<Record<AttributionKey, string>>

// The CRM's lead sources (leadgen-crm shared/constants.ts `SOURCES`) a landing visit can map to.
export type CrmSource = 'web' | 'referral' | 'linkedin' | 'cold' | 'other'

const PAID_MEDIUM_RE = /cpc|ppc|paid|ads?\b|display|banner/

export function crmSourceOf({ ref, utm_source = '', utm_medium = '' }: Attribution): CrmSource {
  const medium = utm_medium.toLowerCase()
  if (ref) return 'cold'
  if (utm_source.toLowerCase().includes('linkedin')) return 'linkedin'
  if (medium === 'referral') return 'referral'
  if (PAID_MEDIUM_RE.test(medium)) return 'other'
  return 'web'
}

export const formatAttribution = (attribution: Attribution) =>
  Object.entries(attribution)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')

// Mailbox providers: their domain says nothing about the sender's company.
const MAILBOX_DOMAINS = new Set([
  'aol.com',
  'atlas.cz',
  'azet.sk',
  'centrum.cz',
  'centrum.sk',
  'email.cz',
  'free.fr',
  'gmail.com',
  'gmx.at',
  'gmx.com',
  'gmx.de',
  'gmx.net',
  'googlemail.com',
  'hey.com',
  'hotmail.com',
  'icloud.com',
  'interia.pl',
  'laposte.net',
  'live.com',
  'mac.com',
  'mail.com',
  'me.com',
  'msn.com',
  'o2.pl',
  'orange.fr',
  'outlook.com',
  'pm.me',
  'post.cz',
  'proton.me',
  'protonmail.com',
  'seznam.cz',
  'spoluzaci.cz',
  't-online.de',
  'tiscali.cz',
  'tutanota.com',
  'volny.cz',
  'web.de',
  'wp.pl',
  'yahoo.com',
  'yandex.com',
  'zoho.com',
  'zoznam.sk',
])

const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/

/** The company website a work address points to, or null for a mailbox provider or malformed address. */
export function companyDomain(email: string): string | null {
  const [, domain, extra] = email.trim().toLowerCase().split('@')
  if (!domain || extra !== undefined || !DOMAIN_RE.test(domain) || MAILBOX_DOMAINS.has(domain)) return null
  return domain
}

/** An http(s) address with a dotted host, or undefined; a bare domain gets `https://`. */
export function httpUrl(value = ''): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
    return /^https?:$/.test(url.protocol) && url.hostname.includes('.') ? url.href : undefined
  } catch {
    return undefined
  }
}
