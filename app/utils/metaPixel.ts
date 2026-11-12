type MetaPixel = (command: string, ...args: unknown[]) => void

/** Sends a standard Meta event; false until consent has loaded the pixel. */
export const trackMetaEvent = (name: string, params?: Record<string, unknown>) => {
  const fbq = import.meta.client ? (window as unknown as { fbq?: MetaPixel }).fbq : undefined
  if (!fbq) return false
  fbq('track', name, params)
  return true
}
