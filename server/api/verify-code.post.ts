import { z } from 'zod'
import { consumeChallenge, issueVerifiedToken } from '~~/server/utils/onboardingTokens'

const schema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  challenge: z.string().min(1),
})

const MESSAGES = {
  expired: 'Verification code has expired. Please request a new one.',
  mismatch: 'Incorrect verification code.',
  invalid: 'Invalid request.',
} as const

export default defineEventHandler(async (event) => {
  const { email, code, challenge } = await readValidatedBody(event, schema.parse)

  const result = consumeChallenge(challenge, email, code)
  if (!result.ok) {
    throw createError({
      statusCode: 400,
      message: MESSAGES[result.reason] ?? MESSAGES.invalid,
      data: { reason: result.reason },
    })
  }

  return { verifiedToken: issueVerifiedToken(email) }
})
