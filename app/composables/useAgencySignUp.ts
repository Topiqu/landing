import type { AgencyOrder } from '~~/shared/utils/plans'

// The agency intent and order travel as query parameters the app validates again.
export const useAgencySignUp = () => {
  const authUrl = usePlatformAuthUrl()
  return (order?: AgencyOrder) => {
    const query = new URLSearchParams({ mode: 'register', intent: 'agency' })
    if (order) {
      query.set('blogs', String(order.blogs))
      query.set('premium', String(order.premium))
      query.set('blocks', String(order.packs))
    }
    return `${authUrl.value}?${query}`
  }
}
