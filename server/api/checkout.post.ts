import { z } from 'zod'
import { signLandingRequest } from '~~/server/utils/landingAuth'
import { verifyVerifiedToken } from '~~/server/utils/onboardingTokens'

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/
const CUSTOM_DOMAIN_RE = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/

// Mirrors the platform's POST /api/onboarding/checkout body. `language` follows its
// LANGUAGE_OPTIONS and `theme` its THEME_OPTIONS.
const schema = z
  .object({
    siteName: z.string().trim().min(1).max(255),
    domain: z.string().trim().toLowerCase().min(1).max(253),
    domainType: z.enum(['SUBDOMAIN', 'CUSTOM']).default('SUBDOMAIN'),
    theme: z.enum(Object.keys(THEME_COLORS) as [ThemeKey, ...ThemeKey[]]).optional(),
    language: z.enum(CONTENT_LANGUAGES),
    username: z.string().trim().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(124),
    verifiedToken: z.string().min(1),
    selectedPlan: z.enum(['PRO', 'PREMIUM']).nullable().optional(),
    billingInterval: z.enum(['month', 'year']).default('month'),
  })
  .refine(
    ({ domain, domainType }) =>
      domainType === 'SUBDOMAIN'
        ? SUBDOMAIN_RE.test(domain)
        : CUSTOM_DOMAIN_RE.test(domain) && !domain.endsWith('.topiqu.com'),
    { path: ['domain'], message: 'Invalid domain' },
  )

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
