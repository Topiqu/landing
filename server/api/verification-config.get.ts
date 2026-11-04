export default defineEventHandler((event) => {
  // A visitor may arrive from prerendered HTML with an outdated public config.
  // Return only the public widget key from the running server, never its secret.
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { siteKey: useRuntimeConfig(event).public.turnstile.siteKey }
})
