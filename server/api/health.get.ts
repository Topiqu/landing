export default defineEventHandler(() => {
  return {
    status: 'ok',
    version: useRuntimeConfig().public.appVersion,
    timestamp: new Date().toISOString(),
  }
})
