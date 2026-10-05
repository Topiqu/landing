import { z } from 'zod'
import { randomInt } from 'crypto'
import { sendVerificationCode } from '~~/server/utils/email'
import { issueChallenge } from '~~/server/utils/onboardingTokens'
import { isDisposableEmail } from '~~/server/utils/disposableEmails'

const schema = z.object({
  email: z.string().email(),
  // Interface locale of the landing: picks the email copy and the magic-link route.
  locale: z.enum(['cs', 'en']).default('en'),
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { email, locale, website, turnstileToken } = await readValidatedBody(event, schema.parse)

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

  // One-click magic link: opens the verify step pre-filled and auto-submits.
  // Carries the challenge because it isn't shared across tabs/persisted.
  const origin = getRequestURL(event).origin
  const verifyPath = locale === 'cs' ? '/cs/onboarding/overeni' : '/en/onboarding/verify'
  const link = `${origin}${verifyPath}?code=${code}&token=${encodeURIComponent(challenge)}`

  await sendVerificationCode({ to: email, code, name, locale, link })

  return { challenge }
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
