import { z } from 'zod'
import { randomInt } from 'crypto'
import { sendVerificationCode } from '~~/server/utils/email'
import { issueChallenge } from '~~/server/utils/onboardingTokens'

const schema = z.object({
  email: z.string().email(),
  language: z.enum(['cs', 'en']).optional(),
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { email, website, turnstileToken } = await readValidatedBody(event, schema.parse)

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

  if (await isEmailRegistered(email)) {
    throw createError({ statusCode: 400, message: 'This email is already registered.' })
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const challenge = issueChallenge(email, code)
  const name = email.split('@')[0] ?? ''

  await sendVerificationCode({ to: email, code, name })

  return { challenge }
})

async function isEmailRegistered(email: string): Promise<boolean> {
  const platformUrl = (useRuntimeConfig() as any).platformApiUrl
  if (!platformUrl) return false
  try {
    const res = await $fetch<{ exists: boolean }>(`${platformUrl}/api/users/check-email`, {
      query: { email },
    })
    return res.exists === true
  } catch {
    return false
  }
}
