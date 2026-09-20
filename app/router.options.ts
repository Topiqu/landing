import type { RouterConfig } from '@nuxt/schema'

export default {
  routes: (routes) => {
    // Keep old unprefixed links working while the public API reference follows
    // the same locale-prefixed URL scheme as the rest of the developer docs.
    return [
      ...routes,
      {
        name: 'legacy-api-reference',
        path: '/api-reference/:pathMatch(.*)*',
        redirect: (to) => {
          const suffix = Array.isArray(to.params.pathMatch) ? to.params.pathMatch.join('/') : to.params.pathMatch
          return `/en/api-reference${suffix ? `/${suffix}` : ''}`
        },
      },
    ]
  },
} satisfies RouterConfig
