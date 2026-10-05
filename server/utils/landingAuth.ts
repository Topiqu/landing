import { createHmac } from 'crypto'

/** Signs the visitor's IP too: the platform rate-limits sign-ups by it and sees only this server. */
export function signLandingRequest(clientIp: string): { timestamp: string; sig: string } {
  const secret = (useRuntimeConfig() as any).authSecret
  if (!secret) throw new Error('AUTH_SECRET is not configured')
  const timestamp = Date.now().toString()
  const sig = createHmac('sha256', secret).update(`${timestamp}.${clientIp}`).digest('hex')
  return { timestamp, sig }
}
