// Surfaces the Better Stack status page's aggregate state to the landing header.
// The status page (status.topiqu.com) exposes a public, token-free JSON summary,
// so we proxy it here to normalise the value and cache it away from the client.

type AggregateState = 'operational' | 'degraded' | 'maintenance' | 'downtime'

// Normalised states used by the UI. Better Stack's "downtime" reads as "down".
type SystemStatus = 'operational' | 'degraded' | 'maintenance' | 'down'

interface StatusPageResponse {
  data?: { attributes?: { aggregate_state?: AggregateState } }
}

const STATE_MAP: Record<AggregateState, SystemStatus> = {
  operational: 'operational',
  degraded: 'degraded',
  maintenance: 'maintenance',
  downtime: 'down',
}

export default defineCachedEventHandler(
  async (): Promise<{ status: SystemStatus }> => {
    const { public: { statusUrl } } = useRuntimeConfig()

    try {
      const res = await $fetch<StatusPageResponse>(`${statusUrl}/index.json`, {
        timeout: 4000,
      })
      const state = res.data?.attributes?.aggregate_state
      return { status: (state && STATE_MAP[state]) || 'operational' }
    } catch {
      // If the status page is unreachable it's almost certainly our fetch, not a
      // real outage — fall back to operational rather than alarming visitors.
      return { status: 'operational' }
    }
  },
  { maxAge: 60, name: 'status', getKey: () => 'aggregate' },
)
