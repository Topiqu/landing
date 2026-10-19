import { randomUUID } from 'node:crypto'
import { getRequestURL, setResponseHeader, getResponseStatus } from 'h3'

import { onboardingLog } from '../utils/onboardingLog'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    if (!/^\/api\/(check-domain|send-code|verify-code|checkout)(?:\?|$)/.test(event.path)) return
    event.context.requestId = randomUUID()
    event.context.requestStartedAt = performance.now()
    setResponseHeader(event, 'X-Request-Id', event.context.requestId)
    setResponseHeader(event, 'Cache-Control', 'no-store')
    onboardingLog(event, 'http.request', { outcome: `${event.method} ${getRequestURL(event).pathname}` })
  })
  nitro.hooks.hook('afterResponse', (event) => {
    if (!event.context.requestId) return
    // Only the route path is logged; verification links contain secrets in the query.
    const path = getRequestURL(event).pathname
    onboardingLog(event, 'http.response', {
      status: getResponseStatus(event),
      durationMs: Math.round(performance.now() - event.context.requestStartedAt),
      outcome: `${event.method} ${path}`,
    })
  })
})
