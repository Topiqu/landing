import { z } from 'zod'
import { signLandingRequest } from '~~/server/utils/landingAuth'
import { verifyVerifiedToken } from '~~/server/utils/onboardingTokens'

const schema = z.object({
  siteName: z.string().min(1).max(255),
  domain: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
  domainType: z.enum(['SUBDOMAIN', 'CUSTOM']).default('SUBDOMAIN'),
  theme: z.string().optional(),
  focus: z.string().optional(),
  language: z.enum(['cs', 'en']),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(124),
  verifiedToken: z.string().min(1),
  selectedPlan: z.enum(['PRO', 'PREMIUM']).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  const config = useRuntimeConfig() as any

  if (!verifyVerifiedToken(body.verifiedToken, body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Email not verified. Please restart the verification step.',
    })
  }

  const platformUrl = config.platformApiUrl
  if (!platformUrl) {
    throw createError({
      statusCode: 503,
      message: 'Registration service is temporarily unavailable.',
    })
  }

  try {
    const { timestamp, sig } = signLandingRequest()
    const res = await $fetch<{ url?: string }>(`${platformUrl}/api/onboarding/checkout`, {
      method: 'POST',
      body,
      headers: {
        'X-Landing-Timestamp': timestamp,
        'X-Landing-Sig': sig,
        'Content-Type': 'application/json',
      },
    })
    return res
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || 'Failed to create account. Please try again.'
    throw createError({ statusCode: error?.statusCode ?? 500, message: msg })
  }
})
