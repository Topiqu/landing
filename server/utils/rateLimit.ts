/** Process-local fixed window: stops one client flooding a dependency, not a distributed limit. */
export function createRateLimit({
  limit,
  windowMs,
  maxKeys = 10_000,
}: {
  limit: number
  windowMs: number
  maxKeys?: number
}) {
  const windows = new Map<string, { count: number; resetAt: number }>()

  return (key: string, now = Date.now()) => {
    const window = windows.get(key)
    if (window && window.resetAt > now) return ++window.count <= limit

    windows.delete(key)
    if (windows.size >= maxKeys) {
      for (const [stale, { resetAt }] of windows) if (resetAt <= now) windows.delete(stale)
      // Still full of live windows: drop the oldest rather than grow without bound.
      if (windows.size >= maxKeys) windows.delete(windows.keys().next().value!)
    }
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
}
