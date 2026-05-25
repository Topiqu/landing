import type { H3Event } from 'h3'

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstileToken(token: string, event: H3Event): Promise<boolean> {
  const secretKey = (useRuntimeConfig() as any).turnstile?.secretKey

  if (!secretKey) {
    if (import.meta.dev) return true
    return false
  }

  if (!token) return false

  try {
    const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestHeader(event, 'x-forwarded-for') || ''
    const res = await $fetch<TurnstileResponse>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: secretKey, response: token, ...(ip ? { remoteip: ip } : {}) }),
    })
    return res.success === true
  } catch {
    return false
  }
}
