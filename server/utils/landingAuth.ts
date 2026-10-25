import { createHmac } from 'crypto'

import { onboardingSecret } from './onboardingTokens'

/** Signs the visitor's IP too: the platform rate-limits sign-ups by it and sees only this server. */
export function signLandingRequest(clientIp: string): { timestamp: string; sig: string } {
  const secret = onboardingSecret()
  const timestamp = Date.now().toString()
  const sig = createHmac('sha256', secret).update(`${timestamp}.${clientIp}`).digest('hex')
  return { timestamp, sig }
}
