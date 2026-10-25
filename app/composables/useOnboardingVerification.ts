import { z } from 'zod'

const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('verified'),
    email: z.string().email(),
    verifiedToken: z.string().min(1),
    challenge: z.string().min(1),
  }),
  z.object({ type: z.literal('received'), challenge: z.string().min(1) }),
])
type VerificationMessage = z.infer<typeof messageSchema>

export const useOnboardingVerification = () => {
  const store = useOnboardingStore()
  const { data, post, isSupported, isClosed } = useBroadcastChannel<unknown, VerificationMessage>({
    name: 'topiqu-onboarding-verification',
  })
  const received = shallowRef(false)
  const shared = shallowRef(false)
  let outgoingChallenge: string | undefined
  let finish: ((accepted: boolean) => void) | undefined

  watch(data, (value) => {
    const result = messageSchema.safeParse(value)
    if (!result.success) return
    const message = result.data
    if (message.type === 'received') {
      if (message.challenge === outgoingChallenge) {
        shared.value = true
        finish?.(true)
      }
      return
    }
    // Only the matching, active registration can receive the proof. Passwords stay in this tab.
    if (
      !store.challenge ||
      !store.form.siteName ||
      !store.canAdvanceAccount ||
      store.form.email.toLowerCase() !== message.email.toLowerCase()
    )
      return
    store.verifiedToken = message.verifiedToken
    store.markStep('verify', 'done')
    post({ type: 'received', challenge: message.challenge })
    received.value = true
  })

  const share = (challenge: string): Promise<boolean> => {
    finish?.(false)
    const verifiedToken = store.verifiedToken
    if (!isSupported.value || isClosed.value || !verifiedToken) return Promise.resolve(false)
    outgoingChallenge = challenge
    shared.value = false
    return new Promise((resolve) => {
      const timer = setTimeout(() => finish?.(false), 1000)
      finish = (accepted) => {
        clearTimeout(timer)
        finish = undefined
        resolve(accepted)
      }
      post({ type: 'verified', email: store.form.email, verifiedToken, challenge })
    })
  }

  onScopeDispose(() => finish?.(false))
  return { received, shared, share }
}
