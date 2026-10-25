import { createHash, createHmac } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { signLandingRequest } from '../server/utils/landingAuth'
import {
  consumeChallenge,
  issueChallenge,
  issueVerifiedToken,
  verifyVerifiedToken,
} from '../server/utils/onboardingTokens'

const originalConfig = (globalThis as any).useRuntimeConfig
const secret = 'test-token-secret'
const config = { authSecret: secret }
beforeAll(() => {
  ;(globalThis as any).useRuntimeConfig = () => config
})
afterAll(() => {
  if (originalConfig === undefined) delete (globalThis as any).useRuntimeConfig
  else (globalThis as any).useRuntimeConfig = originalConfig
})

describe('email verification tokens', () => {
  test('prefers the configured secret when a different legacy secret is also present', () => {
    const previous = process.env.AUTH_SECRET
    try {
      process.env.AUTH_SECRET = 'different-legacy-test-secret'
      const signed = signLandingRequest('203.0.113.4')
      expect(signed.sig).toBe(createHmac('sha256', secret).update(`${signed.timestamp}.203.0.113.4`).digest('hex'))
    } finally {
      if (previous === undefined) delete process.env.AUTH_SECRET
      else process.env.AUTH_SECRET = previous
    }
  })

  test('refuses both verification and checkout signing without a configured secret', () => {
    const previous = process.env.AUTH_SECRET
    try {
      delete process.env.AUTH_SECRET
      config.authSecret = ''
      expect(() => issueVerifiedToken('owner@example.test')).toThrow('AUTH_SECRET is not configured')
      expect(() => signLandingRequest('203.0.113.4')).toThrow('AUTH_SECRET is not configured')
    } finally {
      config.authSecret = secret
      if (previous === undefined) delete process.env.AUTH_SECRET
      else process.env.AUTH_SECRET = previous
    }
  })

  test('does not expose an offline-guessable digest of the six-digit code', () => {
    const token = issueChallenge('Owner@firma.cz', '123456')
    const payload = JSON.parse(Buffer.from(token.split('.')[0]!, 'base64url').toString())
    const input = 'owner@firma.cz:123456'
    expect(payload.h).not.toBe(createHash('sha256').update(input).digest('hex'))
    expect(payload.h).toBe(createHmac('sha256', secret).update(input).digest('hex'))
    expect(consumeChallenge(token, 'owner@firma.cz', '123456')).toEqual({ ok: true })
    expect(consumeChallenge(token, 'owner@firma.cz', '654321')).toEqual({ ok: false, reason: 'mismatch' })
  })

  test('binds a verified token to the email address', () => {
    const token = issueVerifiedToken('Owner@firma.cz')
    expect(verifyVerifiedToken(token, 'owner@firma.cz')).toBe(true)
    expect(verifyVerifiedToken(token, 'other@firma.cz')).toBe(false)
  })

  test.each(['z'.repeat(64), 'a'.repeat(63), ''])('rejects a malformed signature without throwing: %s', (signature) => {
    const token = issueVerifiedToken('owner@firma.cz')
    expect(verifyVerifiedToken(`${token.split('.')[0]}.${signature}`, 'owner@firma.cz')).toBe(false)
  })
})
