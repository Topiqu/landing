import { z } from 'zod'
import { randomInt } from 'crypto'
import { createRateLimit } from '~~/server/utils/rateLimit'
import { sendVerificationCode } from '~~/server/utils/email'
import { issueChallenge } from '~~/server/utils/onboardingTokens'
import { isDisposableEmail } from '~~/server/utils/disposableEmails'
import { attributionSchema, LEAD_TAGS, queueLead } from '~~/server/utils/crm'
import { crmSourceOf, formatAttribution, httpUrl } from '~~/shared/utils/leads'

// A resent code is the same visit: one CRM note per address and hour.
const syncOnce = createRateLimit({ limit: 1, windowMs: 60 * 60_000 })

const schema = z.object({
  email: z.string().email(),
  // Interface locale of the landing: picks the email copy and the magic-link route.
  locale: z.enum(['cs', 'en']).default('en'),
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
  // The site step's address and the landing visit's campaign, only for the CRM.
  websiteUrl: z.string().trim().max(2048).optional(),
  attribution: attributionSchema,
})

export default defineEventHandler(async (event) => {
  const { email, locale, website, turnstileToken, websiteUrl, attribution } = await readValidatedBody(
    event,
    schema.parse,
  )

  if (website && website.trim() !== '') {
    return { challenge: 'ok' }
  }

  // verifyTurnstileToken is auto-imported by @nuxtjs/turnstile. Skip only in
  // local dev when no secret is configured, so onboarding works without keys.
  const secretKey = (useRuntimeConfig(event) as any).turnstile?.secretKey
  if (!(import.meta.dev && !secretKey)) {
    const verification = await verifyTurnstileToken(turnstileToken ?? '', event)
    if (!verification.success) {
      throw createError({ statusCode: 400, message: 'Verification failed. Please try again.' })
    }
  }

  if (isDisposableEmail(email)) {
    throw createError({ statusCode: 400, message: 'Disposable email addresses are not allowed.' })
  }

  // TODO(platform): there is no read-only email check on the platform yet (`/api/users/check-email`
  // never existed), so this fails open and a registered email is only rejected at checkout.
  if (await isEmailRegistered(email)) {
    throw createError({ statusCode: 400, message: 'This email is already registered.' })
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const challenge = issueChallenge(email, code)
  const name = email.split('@')[0] ?? ''

  // A separate entry verifies the link before the wizard requires account details.
  // The fragment keeps the credentials out of HTTP URLs and referrers.
  const origin = getRequestURL(event).origin
  const verifyPath = locale === 'cs' ? '/cs/onboarding/overit-email' : '/en/onboarding/verify-email'
  const link = `${origin}${verifyPath}#${new URLSearchParams({ code, token: challenge })}`

  const delivery = await sendVerificationCode({ to: email, code, name, locale, link, event })

  const campaign = formatAttribution(attribution)
  const confirmed = httpUrl(websiteUrl)
  if (syncOnce(email.toLowerCase())) {
    queueLead(event, {
      email,
      tag: LEAD_TAGS.captured,
      note: [
        `E-mail ověřovaný v onboardingu (${locale})`,
        confirmed && `Web: ${confirmed}`,
        campaign && `Kampaň: ${campaign}`,
      ]
        .filter(Boolean)
        .join('\n'),
      source: crmSourceOf(attribution),
      detail: ['Topiqu landing', 'onboarding', campaign].filter(Boolean).join(' · '),
      website: confirmed,
      confirmedWebsite: true,
    })
  }

  return { challenge, ...delivery }
})

async function isEmailRegistered(email: string): Promise<boolean> {
  const platformUrl = (useRuntimeConfig() as any).platformApiUrl
  if (!platformUrl) return false
  try {
    const res = await $fetch<{ exists: boolean }>(`${platformUrl}/api/users/check-email`, {
      query: { email },
      timeout: 5000,
    })
    return res.exists === true
  } catch {
    return false
  }
}
