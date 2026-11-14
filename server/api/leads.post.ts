import { z } from 'zod'
import { createRateLimit } from '~~/server/utils/rateLimit'
import { isDisposableEmail } from '~~/server/utils/disposableEmails'
import { attributionSchema, LEAD_TAGS, queueLead } from '~~/server/utils/crm'
import { companyDomain, crmSourceOf, formatAttribution, LEAD_SOURCES } from '~~/shared/utils/leads'

const schema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  source: z.enum(LEAD_SOURCES),
  locale: z.enum(['cs', 'en']).default('en'),
  path: z.string().max(200).optional(),
  attribution: attributionSchema,
  // Honeypot: never filled by a person.
  website: z.string().optional(),
})

const allowIp = createRateLimit({ limit: 6, windowMs: 10 * 60_000 })
const allowEmail = createRateLimit({ limit: 2, windowMs: 60 * 60_000 })

export default defineEventHandler(async (event) => {
  // The form posts same-origin; anything else is a forged submission.
  if (getRequestHeader(event, 'sec-fetch-site') === 'cross-site') throw createError({ statusCode: 403 })

  const { email, source, locale, path, attribution, website } = await readValidatedBody(event, schema.parse)
  setResponseStatus(event, 204)
  if (website || isDisposableEmail(email)) return null
  if (!allowIp(getRequestIP(event, { xForwardedFor: true }) ?? '')) throw createError({ statusCode: 429 })
  // A repeat submission of the same address would only stack identical timeline notes.
  if (!allowEmail(email)) return null

  const domain = companyDomain(email)
  const campaign = formatAttribution(attribution)
  const note = [
    `E-mail zadaný na landingu (${source}, ${locale})`,
    path && `Stránka: ${path}`,
    campaign && `Kampaň: ${campaign}`,
  ]
    .filter(Boolean)
    .join('\n')

  queueLead(event, {
    email,
    tag: LEAD_TAGS.captured,
    note,
    source: crmSourceOf(attribution),
    detail: ['Topiqu landing', source, campaign].filter(Boolean).join(' · '),
    website: domain ? `https://${domain}` : undefined,
  })
  return null
})
