import type { H3Event } from 'h3'

import { z } from 'zod'
import { ATTRIBUTION_KEYS, type CrmSource } from '~~/shared/utils/leads'

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
}

type Api = <T>(
  path: string,
  options?: { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown; query?: Record<string, string> },
) => Promise<T>

type ListedLead = { id: number; email: string }

async function findLead(api: Api, email: string) {
  // `q` is a substring search: confirm the exact address.
  const { data } = await api<{ data: ListedLead[] }>('/api/v1/leads', {
    query: { q: email, sort: 'updated', per_page: '20' },
  })
  return data.find((lead) => lead.email.trim().toLowerCase() === email)
}

export function createCrmSync(api: Api) {
  return async ({ tag, note, source, detail, website, confirmedWebsite, ...rest }: CrmLead) => {
    const email = rest.email.trim().toLowerCase()
    const lead = await findLead(api, email)
    if (!lead) {
      await api('/api/v1/leads', {
        method: 'POST',
        body: {
          email,
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
    if (!website) return
    if (!confirmedWebsite) {
      // A guess from the email domain only fills a gap.
      const { data } = await api<{ data: { website: string } }>(`/api/v1/leads/${lead.id}`)
      if (data.website) return
    }
    await api(`/api/v1/leads/${lead.id}`, { method: 'PATCH', body: { website } })
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
