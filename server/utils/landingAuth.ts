import { createHmac } from 'crypto'

export function signLandingRequest(): { timestamp: string; sig: string } {
  const secret = (useRuntimeConfig() as any).authSecret
  if (!secret) throw new Error('AUTH_SECRET is not configured')
  const timestamp = Date.now().toString()
  const sig = createHmac('sha256', secret).update(timestamp).digest('hex')
  return { timestamp, sig }
}
