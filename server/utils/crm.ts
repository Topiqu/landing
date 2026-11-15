import type { H3Event } from 'h3'

import { z } from 'zod'
import { CONTENT_LANGUAGES } from '~~/shared/utils/plans'
import { ATTRIBUTION_KEYS, type CrmSource, httpUrl } from '~~/shared/utils/leads'

import { onboardingLog } from './onboardingLog'

// Lifecycle lives in tags; the CRM's stages stay a salesperson's call (its Rules can act on these tags).
export const LEAD_TAGS = {
  captured: 'zachycen',
  registered: 'registrovan',
} as const

export const attributionSchema = z.partialRecord(z.enum(ATTRIBUTION_KEYS), z.string().trim().max(200)).default({})

export type CrmLead = {
  email: string
  tag: (typeof LEAD_TAGS)[keyof typeof LEAD_TAGS]
  // Internal note of a new lead, or the activity logged on a lead the CRM already has.
  note: string
  // Source and its detail (max 300 characters) of a new lead; an existing lead keeps its own.
  source: CrmSource
  detail: string
  website?: string
  // The visitor confirmed `website` themselves, so it replaces what the CRM has.
  confirmedWebsite?: boolean
  // The blog's name and the username: they only fill a gap, a salesperson's entry stays.
  company?: string
  name?: string
}

// The wizard's non-secret entries, only for the CRM: a bad one is dropped, never a reason to refuse the request.
const entry = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined)
export const onboardingSchema = z.object({
  siteName: entry(z.string().trim().max(255)),
  domain: entry(z.string().trim().toLowerCase().max(253)),
  domainType: entry(z.enum(['SUBDOMAIN', 'CUSTOM'])),
  language: entry(z.enum(CONTENT_LANGUAGES)),
  // Not `website`: that name is the bot honeypot.
  websiteUrl: entry(z.string().trim().max(2048)),
  username: entry(z.string().trim().max(50)),
  selectedPlan: entry(z.enum(['PRO', 'PREMIUM', 'CUSTOM']).nullable()),
  billingInterval: entry(z.enum(['month', 'year'])),
})
export type OnboardingEntries = z.infer<typeof onboardingSchema>

/** The wizard's entries as note lines and lead fields; a plan left out was not chosen yet. */
export function onboardingLead(entries: Partial<OnboardingEntries>) {
  const blog = entries.domain && (entries.domainType === 'CUSTOM' ? entries.domain : `${entries.domain}.topiqu.com`)
  const website = httpUrl(entries.websiteUrl)
  const plan =
    entries.selectedPlan === undefined
      ? ''
      : entries.selectedPlan
        ? `${entries.selectedPlan} (${entries.billingInterval ?? 'month'})`
        : 'FREE'
  return {
    lines: [
      (entries.siteName || blog) && `Blog: ${[entries.siteName, blog && `(${blog})`].filter(Boolean).join(' ')}`,
      entries.language && `Jazyk: ${entries.language}`,
      website && `Web firmy: ${website}`,
      plan && `Tarif: ${plan}`,
      entries.username && `Uživatel: ${entries.username}`,
    ].filter((line): line is string => Boolean(line)),
    website,
    company: entries.siteName || undefined,
    name: entries.username || undefined,
  }
}

type Api = <T>(
  path: string,
  options?: { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown; query?: Record<string, string> },
) => Promise<T>

type ListedLead = { id: number; email: string }
type LeadFields = { website?: string | null; company?: string | null; name?: string | null }

async function findLead(api: Api, email: string) {
  // `q` is a substring search: confirm the exact address.
  const { data } = await api<{ data: ListedLead[] }>('/api/v1/leads', {
    query: { q: email, sort: 'updated', per_page: '20' },
  })
  return data.find((lead) => lead.email.trim().toLowerCase() === email)
}

export function createCrmSync(api: Api) {
  return async ({ tag, note, source, detail, website, confirmedWebsite, company, name, ...rest }: CrmLead) => {
    const email = rest.email.trim().toLowerCase()
    const lead = await findLead(api, email)
    if (!lead) {
      await api('/api/v1/leads', {
        method: 'POST',
        body: {
          email,
          ...(name && { name }),
          ...(company && { company }),
          ...(website && { website }),
          source,
          sourceDetail: detail.slice(0, 300),
          notes: note,
          stage: 'new',
          legalBasis: 'contract',
          tags: [tag],
        },
      })
      return
    }
    await api(`/api/v1/leads/${lead.id}/activities`, { method: 'POST', body: { type: 'note', body: note } })
    await api(`/api/v1/leads/${lead.id}/tags`, { method: 'POST', body: { tag, present: true } })
    if (!website && !company && !name) return
    const { data } = await api<{ data: LeadFields }>(`/api/v1/leads/${lead.id}`)
    const body = {
      // A guess from the email domain only fills a gap.
      ...(website && website !== data.website && (confirmedWebsite || !data.website) && { website }),
      ...(company && !data.company && { company }),
      ...(name && !data.name && { name }),
    }
    if (Object.keys(body).length) await api(`/api/v1/leads/${lead.id}`, { method: 'PATCH', body })
  }
}

/** Runs the sync after the response; the funnel never waits for, or fails on, the CRM. */
export function queueLead(event: H3Event, lead: CrmLead) {
  const task = syncLead(event, lead)
  event.waitUntil?.(task)
}

/** Writes the lead to the CRM's external API; a no-op until both env values are set. Never throws. */
export async function syncLead(event: H3Event | undefined, lead: CrmLead) {
  const { crmUrl, crmApiKey } = useRuntimeConfig() as any
  if (!crmUrl || !crmApiKey) return

  const startedAt = performance.now()
  const api = $fetch.create({
    baseURL: crmUrl,
    headers: { Authorization: `Bearer ${crmApiKey}` },
    timeout: 8000,
    retry: 0,
  }) as Api
  try {
    await createCrmSync(api)(lead)
    onboardingLog(event, 'crm.synced', {
      dependency: 'crm',
      outcome: lead.tag,
      durationMs: Math.round(performance.now() - startedAt),
    })
  } catch (error: any) {
    onboardingLog(event, 'crm.failed', {
      dependency: 'crm',
      status: 503,
      upstreamStatus: error?.statusCode ?? error?.response?.status,
      outcome: lead.tag,
      durationMs: Math.round(performance.now() - startedAt),
    })
  }
}
