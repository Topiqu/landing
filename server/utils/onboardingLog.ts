import type { H3Event } from 'h3'

type LogFields = {
  status?: number
  durationMs?: number
  dependency?: 'platform' | 'ses'
  outcome?: string
  messageId?: string
  region?: string
  providerRequestId?: string
}

/** Deliberately excludes bodies, query strings, tokens, email addresses and raw errors. */
export function onboardingLog(event: H3Event | undefined, action: string, fields: LogFields = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    service: 'topiqu-landing',
    action,
    requestId: event?.context?.requestId,
    ...fields,
  }
  const write = fields.status && fields.status >= 500 ? console.error : console.info
  write(JSON.stringify(record))
}
