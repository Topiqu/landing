type MetaPixel = (command: string, ...args: unknown[]) => void

/** Sends a standard Meta event; false until consent has loaded the pixel. */
export const trackMetaEvent = (name: string, params?: Record<string, unknown>, options?: { eventID?: string }) => {
  const fbq = import.meta.client ? (window as unknown as { fbq?: MetaPixel }).fbq : undefined
  if (!fbq) return false
  fbq('track', name, params, options)
  return true
}

/** Mirrors the platform's `metaRegistrationId`, so Meta counts a sign-up reported by the pixel and the server once. */
export const metaRegistrationId = async (email: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()))
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return `registration-${hex.slice(0, 40)}`
}
