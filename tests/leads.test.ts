import { describe, expect, mock, test } from 'bun:test'

import { createRateLimit } from '../server/utils/rateLimit'
import { companyDomain, crmSourceOf, httpUrl } from '../shared/utils/leads'
import { createCrmSync, LEAD_TAGS, type CrmLead } from '../server/utils/crm'

const crm = (leads: { id: number; email: string }[], website = '') => {
  const api = mock(async (path: string, options?: { method?: string }) => {
    if (options?.method) return {}
    return path === '/api/v1/leads' ? { data: leads } : { data: { website } }
  })
  return { api, sync: createCrmSync(api as never), writes: () => api.mock.calls.filter(([, o]) => o?.method) }
}

const lead = (overrides: Partial<CrmLead> = {}): CrmLead => ({
  email: 'Jan@Heatwise.cz',
  tag: LEAD_TAGS.captured,
  note: 'n',
  source: 'web',
  detail: 'Topiqu landing · hero',
  ...overrides,
})

describe('lead helpers', () => {
  test('reads the company website from a work address only', () => {
    expect(companyDomain(' Jan@Heatwise.CZ ')).toBe('heatwise.cz')
    expect(companyDomain('jan@seznam.cz')).toBeNull()
    expect(companyDomain('jan@gmail.com')).toBeNull()
    expect(companyDomain('jan@localhost')).toBeNull()
    expect(companyDomain('a@b@heatwise.cz')).toBeNull()
  })

  test('maps the campaign to the CRM source', () => {
    expect(crmSourceOf({})).toBe('web')
    expect(crmSourceOf({ ref: 'centrum-vytapeni', utm_medium: 'email' })).toBe('cold')
    expect(crmSourceOf({ utm_source: 'LinkedIn', utm_medium: 'cpc' })).toBe('linkedin')
    expect(crmSourceOf({ utm_source: 'topiqu_blog', utm_medium: 'referral' })).toBe('referral')
    expect(crmSourceOf({ utm_source: 'facebook', utm_medium: 'paid_social' })).toBe('other')
  })

  test('accepts only http(s) addresses with a dotted host', () => {
    expect(httpUrl('heatwise.cz')).toBe('https://heatwise.cz/')
    expect(httpUrl('http://heatwise.cz/blog')).toBe('http://heatwise.cz/blog')
    expect(httpUrl('javascript:alert(1)')).toBeUndefined()
    expect(httpUrl('localhost')).toBeUndefined()
    expect(httpUrl('')).toBeUndefined()
  })
})

describe('CRM sync', () => {
  test('creates a new lead in the first stage with the lifecycle tag', async () => {
    const { api, writes, sync } = crm([{ id: 7, email: 'xjan@heatwise.cz' }])
    await sync(lead({ website: 'https://heatwise.cz' }))
    expect(api.mock.calls[0]![1]).toMatchObject({ query: { q: 'jan@heatwise.cz' } })
    expect(writes()).toEqual([
      [
        '/api/v1/leads',
        {
          method: 'POST',
          body: {
            email: 'jan@heatwise.cz',
            website: 'https://heatwise.cz',
            source: 'web',
            sourceDetail: 'Topiqu landing · hero',
            notes: 'n',
            stage: 'new',
            legalBasis: 'contract',
            tags: [LEAD_TAGS.captured],
          },
        },
      ],
    ])
  })

  test('an existing lead gets a note and the tag, never a stage change', async () => {
    const { writes, sync } = crm([{ id: 7, email: 'jan@heatwise.cz' }])
    await sync(lead({ tag: LEAD_TAGS.registered, note: 'again' }))
    expect(writes()).toEqual([
      ['/api/v1/leads/7/activities', { method: 'POST', body: { type: 'note', body: 'again' } }],
      ['/api/v1/leads/7/tags', { method: 'POST', body: { tag: LEAD_TAGS.registered, present: true } }],
    ])
  })

  test('a website guessed from the email only fills a gap; a confirmed one replaces it', async () => {
    const known = crm([{ id: 7, email: 'jan@heatwise.cz' }], 'https://old.cz')
    await known.sync(lead({ website: 'https://heatwise.cz' }))
    expect(known.writes()).toHaveLength(2)

    const empty = crm([{ id: 7, email: 'jan@heatwise.cz' }])
    await empty.sync(lead({ website: 'https://heatwise.cz' }))
    expect(empty.writes()[2]).toEqual([
      '/api/v1/leads/7',
      { method: 'PATCH', body: { website: 'https://heatwise.cz' } },
    ])

    const confirmed = crm([{ id: 7, email: 'jan@heatwise.cz' }], 'https://old.cz')
    await confirmed.sync(lead({ website: 'https://heatwise.cz', confirmedWebsite: true }))
    expect(confirmed.writes()[2]![1]).toEqual({ method: 'PATCH', body: { website: 'https://heatwise.cz' } })
  })
})

describe('rate limit', () => {
  test('allows the limit per window, then resets', () => {
    const allow = createRateLimit({ limit: 2, windowMs: 1000 })
    expect([allow('ip', 0), allow('ip', 10), allow('ip', 20)]).toEqual([true, true, false])
    expect(allow('other', 20)).toBe(true)
    expect(allow('ip', 1000)).toBe(true)
  })

  test('stays bounded when every window is live', () => {
    const allow = createRateLimit({ limit: 1, windowMs: 1000, maxKeys: 2 })
    allow('a', 0)
    allow('b', 0)
    allow('c', 0)
    expect(allow('a', 1)).toBe(true)
  })
})
