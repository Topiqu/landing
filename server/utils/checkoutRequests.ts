import { createError } from 'h3'
import { createHmac } from 'node:crypto'

type CheckoutResult = { url: string }
type Entry = { fingerprint: string; result: Promise<CheckoutResult> }

/** Coalesce only in-flight requests; the platform owns durable recovery and current redirects. */
export function createCheckoutRequests(maxEntries = 500) {
  const entries = new Map<string, Entry>()
  return (identity: string, fingerprint: string, run: () => Promise<CheckoutResult>) => {
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
    const entry: Entry = { fingerprint, result: Promise.resolve().then(run) }
    entries.set(identity, entry)
    entry.result = entry.result.then(
      (result) => {
        entries.delete(identity)
        return result
      },
      (error) => {
        // The platform persists signup progress and Stripe keys; an explicit retry resumes it.
        entries.delete(identity)
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
