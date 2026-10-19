import { createError } from 'h3'
import { createHmac } from 'node:crypto'

type CheckoutResult = { url: string }
type Entry = { fingerprint: string; expiresAt: number; result: Promise<CheckoutResult> }

/** Process-local protection. Durable, cross-instance idempotency belongs on the platform. */
export function createCheckoutRequests(ttlMs = 10 * 60_000, maxEntries = 500) {
  const entries = new Map<string, Entry>()
  return (identity: string, fingerprint: string, run: () => Promise<CheckoutResult>) => {
    const now = Date.now()
    for (const [key, entry] of entries) if (entry.expiresAt <= now) entries.delete(key)
    const existing = entries.get(identity)
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw createError({
          statusCode: 409,
          message: 'A registration for this email has already been submitted.',
          data: { reason: 'checkoutConflict' },
        })
      }
      return existing.result
    }
    if (entries.size >= maxEntries)
      throw createError({ statusCode: 503, message: 'Registration is busy. Please try again later.' })
    const entry: Entry = { fingerprint, expiresAt: Infinity, result: Promise.resolve().then(run) }
    entries.set(identity, entry)
    entry.result = entry.result.then(
      (result) => {
        entry.expiresAt = Date.now() + ttlMs
        return result
      },
      (error) => {
        // Do not blindly replay a mutation whose upstream outcome is unknown.
        if (error?.statusCode >= 400 && error.statusCode < 500) entries.delete(identity)
        else entry.expiresAt = Date.now() + ttlMs
        throw error
      },
    )
    return entry.result
  }
}

export function checkoutKeys(secret: string, body: { email: string; verifiedToken: string; [key: string]: unknown }) {
  const payload = Object.fromEntries(Object.entries(body).filter(([key]) => key !== 'verifiedToken'))
  const digest = (value: string) => createHmac('sha256', secret).update(value).digest('hex')
  return {
    identity: digest(`checkout:${body.email.toLowerCase()}`),
    fingerprint: digest(JSON.stringify(payload)),
  }
}
