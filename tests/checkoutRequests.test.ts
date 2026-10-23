import { describe, expect, test, mock } from 'bun:test'

import { createCheckoutRequests, checkoutKeys } from '../server/utils/checkoutRequests'

describe('checkout request protection', () => {
  test('coalesces concurrent requests and replays successful results', async () => {
    const run = mock(async () => ({ url: 'https://app.example.test/login' }))
    const execute = createCheckoutRequests()
    const [first, second] = await Promise.all([execute('owner', 'body', run), execute('owner', 'body', run)])
    expect(first).toEqual(second)
    expect(await execute('owner', 'body', run)).toEqual(first)
    expect(run).toHaveBeenCalledTimes(1)
  })

  test('retains uncertain outcomes instead of repeating account creation', async () => {
    const run = mock(async () => {
      throw Object.assign(new Error('Timeout'), { statusCode: 503 })
    })
    const execute = createCheckoutRequests()
    await expect(execute('owner', 'body', run)).rejects.toMatchObject({ statusCode: 503 })
    await expect(execute('owner', 'body', run)).rejects.toMatchObject({ statusCode: 503 })
    expect(run).toHaveBeenCalledTimes(1)
    expect(() => execute('owner', 'changed-body', run)).toThrow()
  })

  test('allows a corrected request after an explicit rejection', async () => {
    const execute = createCheckoutRequests()
    await expect(
      execute('owner', 'body', async () => {
        throw { statusCode: 400 }
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
    expect(await execute('owner', 'changed-body', async () => ({ url: 'https://app.example.test' }))).toEqual({
      url: 'https://app.example.test',
    })
  })

  test('bounds memory without evicting in-flight or uncertain requests', async () => {
    const execute = createCheckoutRequests(60_000, 1)
    await execute('owner', 'body', async () => ({ url: 'https://app.example.test' }))
    expect(() => execute('other-owner', 'body', async () => ({ url: 'https://app.example.test' }))).toThrow()
  })

  test('keys contain no credentials and remain stable when verification is renewed', () => {
    const body = { email: 'owner@example.test', password: 'secret', verifiedToken: 'first' }
    const first = checkoutKeys('test-secret', body)
    expect(checkoutKeys('test-secret', { ...body, verifiedToken: 'renewed' })).toEqual(first)
    expect(first.identity).toMatch(/^[a-f0-9]{64}$/)
    expect(first.fingerprint).toMatch(/^[a-f0-9]{64}$/)
    expect(checkoutKeys('test-secret', { ...body, password: 'changed' }).fingerprint).not.toBe(first.fingerprint)
  })

  test('expires completed results instead of retaining login links indefinitely', async () => {
    const execute = createCheckoutRequests(0)
    const run = mock(async () => ({ url: 'https://app.example.test/login' }))
    await execute('owner', 'body', run)
    await execute('owner', 'body', run)
    expect(run).toHaveBeenCalledTimes(2)
  })
})
