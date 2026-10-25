import type { Ref } from 'vue'

interface VerificationCodeRequest {
  siteKey: Readonly<Ref<string>>
  token: Ref<string | undefined>
  blocked: Readonly<Ref<boolean>>
  send: (token: string) => Promise<boolean>
  reset: () => void
}

export const useVerificationCodeRequest = (options: VerificationCodeRequest) => {
  const waiting = shallowRef(false)
  const error = shallowRef<'unavailable' | 'verification' | null>(null)
  let disposed = false
  let cancel: (() => void) | undefined

  const invalidate = () => {
    options.token.value = undefined
  }

  const fail = () => {
    invalidate()
    error.value = 'verification'
    cancel?.()
  }

  const nextToken = (): Promise<string | undefined> => {
    if (options.token.value) return Promise.resolve(options.token.value)
    return new Promise((resolve) => {
      const finish = (token?: string) => {
        clearTimeout(timer)
        stop()
        cancel = undefined
        resolve(token)
      }
      const stop = watch(options.token, (token) => {
        if (token) finish(token)
      })
      const timer = setTimeout(() => {
        error.value = 'verification'
        finish()
      }, 20_000)
      cancel = () => finish()
    })
  }

  const request = async () => {
    if (disposed || waiting.value || options.blocked.value) return false
    const retry = error.value === 'verification'
    error.value = null
    if (!options.siteKey.value) {
      error.value = 'unavailable'
      return false
    }
    waiting.value = true
    try {
      if (retry) options.reset()
      const token = await nextToken()
      if (!token || disposed || options.blocked.value) return false
      waiting.value = false
      try {
        return await options.send(token)
      } finally {
        // Clear before reset: the widget may synchronously supply its next token.
        invalidate()
        if (!disposed) options.reset()
      }
    } finally {
      waiting.value = false
    }
  }

  onScopeDispose(() => {
    disposed = true
    cancel?.()
  })

  return { waiting, error, request, fail, invalidate }
}
