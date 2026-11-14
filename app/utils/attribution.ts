// ATTRIBUTION_KEYS comes from auto-imports: a relative shared/ import breaks the production server bundle.
import type { Attribution } from '~~/shared/utils/leads'

const STORAGE_KEY = 'topiqu.attribution'

/** Keeps the campaign of the visit's latest tagged URL for the session, so the onboarding steps still know it. */
export function rememberAttribution(search: string) {
  const params = new URLSearchParams(search)
  const tagged = Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = params.get(key)?.trim()
      return value ? [[key, value.slice(0, 200)]] : []
    }),
  )
  if (!Object.keys(tagged).length) return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tagged))
  } catch {
    // Blocked storage only loses the campaign, never the visit.
  }
}

export function readAttribution(): Attribution {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}')
    return Object.fromEntries(
      ATTRIBUTION_KEYS.flatMap((key) => (typeof stored[key] === 'string' ? [[key, stored[key]]] : [])),
    )
  } catch {
    return {}
  }
}
