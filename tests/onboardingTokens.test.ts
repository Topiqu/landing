import { createHash, createHmac } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import {
  consumeChallenge,
  issueChallenge,
  issueVerifiedToken,
  verifyVerifiedToken,
} from '../server/utils/onboardingTokens'

const originalConfig = (globalThis as any).useRuntimeConfig
const secret = 'test-token-secret'
beforeAll(() => {
  ;(globalThis as any).useRuntimeConfig = () => ({ authSecret: secret })
})
afterAll(() => {
  if (originalConfig === undefined) delete (globalThis as any).useRuntimeConfig
  else (globalThis as any).useRuntimeConfig = originalConfig
})

describe('email verification tokens', () => {
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
