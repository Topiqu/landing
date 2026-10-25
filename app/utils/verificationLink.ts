import type { LocationQuery } from 'vue-router'

export const readVerificationLink = (query: LocationQuery, hash = '') => {
  const fragment = new URLSearchParams(hash.replace(/^#/, ''))
  if (fragment.getAll('code').length > 1 || fragment.getAll('token').length > 1) return null
  const source = fragment.has('code') || fragment.has('token') ? Object.fromEntries(fragment) : query
  const code = source.code
  const challenge = source.token
  return typeof code === 'string' && /^\d{6}$/.test(code) && typeof challenge === 'string' && challenge
    ? { code, challenge }
    : null
}
