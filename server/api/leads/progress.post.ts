import { z } from 'zod'
import { createRateLimit } from '~~/server/utils/rateLimit'
import { isDisposableEmail } from '~~/server/utils/disposableEmails'
import { crmSourceOf, formatAttribution } from '~~/shared/utils/leads'
import { attributionSchema, LEAD_TAGS, onboardingLead, onboardingSchema, queueLead } from '~~/server/utils/crm'

const STEPS = { site: 'blog a web', plan: 'tarif' } as const

const schema = onboardingSchema.extend({
  email: z.string().trim().toLowerCase().max(254).email(),
  step: z.enum(['site', 'plan']),
  locale: z.enum(['cs', 'en']).default('en'),
  attribution: attributionSchema,
  // Honeypot: never filled by a person.
  website: z.string().optional(),
})

const allowIp = createRateLimit({ limit: 12, windowMs: 10 * 60_000 })
// Going back and forth in the wizard is one visit: one CRM note per address, step and hour.
const syncOnce = createRateLimit({ limit: 1, windowMs: 60 * 60_000 })

/** A wizard step finished by a visitor whose address is already known; the rest arrives with `send-code`. */
export default defineEventHandler(async (event) => {
  // The wizard posts same-origin; anything else is a forged submission.
  if (getRequestHeader(event, 'sec-fetch-site') === 'cross-site') throw createError({ statusCode: 403 })

  const { email, step, locale, attribution, website, ...entries } = await readValidatedBody(event, schema.parse)
  setResponseStatus(event, 204)
  if (website || isDisposableEmail(email)) return null
  if (!allowIp(getRequestIP(event, { xForwardedFor: true }) ?? '')) throw createError({ statusCode: 429 })

  const { lines, ...fields } = onboardingLead(entries)
  if (!lines.length || !syncOnce(`${email}:${step}`)) return null

  const campaign = formatAttribution(attribution)
  queueLead(event, {
    email,
    tag: LEAD_TAGS.captured,
    note: [`Onboarding, krok ${STEPS[step]} (${locale})`, ...lines, campaign && `Kampaň: ${campaign}`]
      .filter(Boolean)
      .join('\n'),
    source: crmSourceOf(attribution),
    detail: ['Topiqu landing', 'onboarding', campaign].filter(Boolean).join(' · '),
    ...fields,
    confirmedWebsite: true,
  })
  return null
})
