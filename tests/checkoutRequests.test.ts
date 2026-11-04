import { describe, expect, test, mock } from 'bun:test'

import { createCheckoutRequests, checkoutKeys } from '../server/utils/checkoutRequests'

describe('checkout request protection', () => {
  test('coalesces concurrent requests and asks the platform to reconcile subsequent retries', async () => {
    const run = mock(async () => ({ url: 'https://app.example.test/login' }))
    const execute = createCheckoutRequests()
    const [first, second] = await Promise.all([execute('owner', 'body', run), execute('owner', 'body', run)])
    expect(first).toEqual(second)
    expect(await execute('owner', 'body', run)).toEqual(first)
    expect(run).toHaveBeenCalledTimes(2)
  })

  test('allows an explicit retry after an uncertain outcome so the platform can resume it', async () => {
    const run = mock(async () => {
      throw Object.assign(new Error('Timeout'), { statusCode: 503 })
    })
    const execute = createCheckoutRequests()
    await expect(execute('owner', 'body', run)).rejects.toMatchObject({ statusCode: 503 })
    await expect(execute('owner', 'body', run)).rejects.toMatchObject({ statusCode: 503 })
    expect(run).toHaveBeenCalledTimes(2)
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

  test('bounds memory without evicting in-flight requests, then releases completed redirects', async () => {
    const execute = createCheckoutRequests(1)
    let finish!: (value: { url: string }) => void
    const pending = execute(
      'owner',
      'body',
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    await Promise.resolve()
    expect(() => execute('owner', 'changed-body', async () => ({ url: 'https://app.example.test' }))).toThrow()
    expect(() => execute('other-owner', 'body', async () => ({ url: 'https://app.example.test' }))).toThrow()
    finish({ url: 'https://app.example.test' })
    await pending
    expect(await execute('other-owner', 'body', async () => ({ url: 'https://app.example.test' }))).toHaveProperty(
      'url',
    )
  })

  test('keys contain no credentials and remain stable when verification is renewed', () => {
    const body = { email: 'owner@example.test', password: 'secret', verifiedToken: 'first' }
    const first = checkoutKeys('test-secret', body)
    expect(checkoutKeys('test-secret', { ...body, verifiedToken: 'renewed' })).toEqual(first)
    expect(first.identity).toMatch(/^[a-f0-9]{64}$/)
    expect(first.fingerprint).toMatch(/^[a-f0-9]{64}$/)
    expect(checkoutKeys('test-secret', { ...body, password: 'changed' }).fingerprint).not.toBe(first.fingerprint)
  })

  test('never retains a completed single-use login link', async () => {
    const execute = createCheckoutRequests()
    const run = mock(async () => ({ url: 'https://app.example.test/login' }))
    await execute('owner', 'body', run)
    await execute('owner', 'body', run)
    expect(run).toHaveBeenCalledTimes(2)
  })
})
