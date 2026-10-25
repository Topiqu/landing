import { z } from 'zod'
import { onboardingLog } from '~~/server/utils/onboardingLog'
import { signLandingRequest } from '~~/server/utils/landingAuth'
import { createCheckoutRequests, checkoutKeys } from '~~/server/utils/checkoutRequests'
import { onboardingSecret, verifyVerifiedToken } from '~~/server/utils/onboardingTokens'

const checkoutRequests = createCheckoutRequests()

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/
const CUSTOM_DOMAIN_RE = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/

// Mirrors the platform's POST /api/onboarding/checkout body. `language` follows its
// LANGUAGE_OPTIONS, `theme` its THEME_OPTIONS and the branding fields its ClientSite columns.
const HEX_RE = /^#[0-9a-f]{6}$/i
const schema = z
  .object({
    siteName: z.string().trim().min(1).max(255),
    domain: z.string().trim().toLowerCase().min(1).max(253),
    domainType: z.enum(['SUBDOMAIN', 'CUSTOM']).default('SUBDOMAIN'),
    theme: z.enum(Object.keys(THEME_COLORS) as [ThemeKey, ...ThemeKey[]]).optional(),
    accentColor: z.string().regex(HEX_RE).optional(),
    brandGradient: z
      .object({ colors: z.array(z.string().regex(HEX_RE)).min(2).max(3), angle: z.number().int().min(0).max(360) })
      .strict()
      .optional(),
    typographyPreset: z.enum(TYPOGRAPHY_PRESETS).optional(),
    tagline: z.string().trim().max(80).optional(),
    // Not `website`: that name is the bot honeypot. The platform keeps only a valid http(s) address.
    websiteUrl: z.string().trim().max(2048).optional(),
    websiteImportConsentVersion: z.literal(1).optional(),
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

  const { identity, fingerprint } = checkoutKeys(onboardingSecret(), body)
  return checkoutRequests(identity, fingerprint, async () => {
    const startedAt = performance.now()
    try {
      // Vercel overwrites X-Forwarded-For with the visitor's address, so it cannot be spoofed here.
      const clientIp = getRequestIP(event, { xForwardedFor: true }) ?? ''
      const { timestamp, sig } = signLandingRequest(clientIp)
      const res = await $fetch<{ url?: string }>(`${platformUrl}/api/onboarding/checkout`, {
        method: 'POST',
        timeout: 30_000,
        retry: 0,
        body,
        headers: {
          'X-Landing-Client-Ip': clientIp,
          'X-Landing-Timestamp': timestamp,
          'X-Landing-Sig': sig,
          'Content-Type': 'application/json',
          'Idempotency-Key': fingerprint,
          ...(event.context?.requestId ? { 'X-Request-Id': event.context.requestId } : {}),
        },
      })
      if (!res?.url || !/^https?:\/\//.test(res.url)) throw new Error('Invalid checkout response')
      onboardingLog(event, 'checkout.completed', {
        dependency: 'platform',
        status: 200,
        durationMs: Math.round(performance.now() - startedAt),
      })
      return { url: res.url }
    } catch (error: any) {
      const upstreamStatus = error?.statusCode ?? error?.response?.status
      const rejected = upstreamStatus >= 400 && upstreamStatus < 500
      const status = rejected ? upstreamStatus : 503
      onboardingLog(event, 'checkout.failed', {
        dependency: 'platform',
        status,
        durationMs: Math.round(performance.now() - startedAt),
        outcome: rejected ? 'rejected' : 'unknown',
      })
      throw createError({
        statusCode: status,
        message: rejected
          ? 'Registration could not be completed. Check your details or sign in if you already have an account.'
          : 'Registration outcome could not be confirmed. Check your email or sign in before trying again.',
        data: { reason: rejected ? 'checkoutRejected' : 'checkoutUnknown' },
      })
    }
  })
})
