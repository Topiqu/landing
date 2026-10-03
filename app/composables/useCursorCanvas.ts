export interface CursorCanvasSize {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
}

export interface CursorCanvasFrame extends CursorCanvasSize {
  /** Eased pointer position in CSS pixels, relative to the host. */
  x: number
  y: number
  /** 0 while the pointer is away, easing to 1 while it rests over the host. */
  strength: number
  /** Resolves a CSS custom property on the host, e.g. `--landing-accent`. */
  color: (token: string) => string
}

interface CursorCanvasOptions {
  draw: (frame: CursorCanvasFrame) => void
  /** Recomputes geometry after a resize or theme change. */
  layout?: (size: CursorCanvasSize) => void
}

/**
 * Draws a decorative canvas behind `host` that reacts to the mouse.
 * Touch devices get a slow automatic drift; reduced motion gets one static frame.
 * The loop only runs while the host is visible and the effect is still settling.
 */
export function useCursorCanvas(
  host: Readonly<Ref<HTMLElement | null>>,
  canvas: Readonly<Ref<HTMLCanvasElement | null>>,
  options: CursorCanvasOptions,
) {
  const reducedMotion = usePreferredReducedMotion()
  const touch = useMediaQuery('(hover: none)')
  const visible = useElementVisibility(host)
  const animated = computed(() => reducedMotion.value !== 'reduce')
  const drifting = computed(() => animated.value && touch.value)

  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let frame = 0
  let colors: Record<string, string> = {}
  const pointer = { x: 0, y: 0, active: false }
  const eased = { x: 0, y: 0, strength: 0 }

  const color = (token: string) =>
    (colors[token] ??= host.value ? getComputedStyle(host.value).getPropertyValue(token).trim() : '')

  const render = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    options.draw({ ctx, width, height, ...eased, color })
  }

  const tick = (time: number) => {
    frame = 0
    if (drifting.value) {
      pointer.x = width * (0.5 + 0.34 * Math.sin(time / 4300))
      pointer.y = height * (0.5 + 0.3 * Math.sin(time / 3100))
      pointer.active = true
    }
    const target = pointer.active ? 1 : 0
    eased.x += (pointer.x - eased.x) * 0.14
    eased.y += (pointer.y - eased.y) * 0.14
    eased.strength += (target - eased.strength) * 0.08
    render()
    const settled =
      Math.abs(pointer.x - eased.x) < 0.3 &&
      Math.abs(pointer.y - eased.y) < 0.3 &&
      Math.abs(target - eased.strength) < 0.004
    if (visible.value && (drifting.value || !settled)) frame = requestAnimationFrame(tick)
  }

  const start = () => {
    if (!frame && ctx && animated.value && visible.value) frame = requestAnimationFrame(tick)
  }
  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  const resize = () => {
    const element = canvas.value
    if (!element || !host.value) return
    width = host.value.clientWidth
    height = host.value.clientHeight
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
    ctx = element.getContext('2d')
    if (!ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    colors = {}
    options.layout?.({ ctx, width, height })
    render()
  }

  useResizeObserver(host, resize)
  useEventListener(host, 'pointermove', (event: PointerEvent) => {
    if (event.pointerType === 'touch' || drifting.value || !host.value) return
    const rect = host.value.getBoundingClientRect()
    pointer.x = event.clientX - rect.left
    pointer.y = event.clientY - rect.top
    // Start at the cursor instead of sliding in from the last position.
    if (eased.strength < 0.02) {
      eased.x = pointer.x
      eased.y = pointer.y
    }
    pointer.active = true
    start()
  })
  useEventListener(host, 'pointerleave', () => {
    if (drifting.value) return
    pointer.active = false
    start()
  })
  watch([visible, drifting], () => (visible.value ? start() : stop()))

  // The theme store toggles `.dark` on <html>; cached colours must follow it.
  let themeObserver: MutationObserver | undefined
  onMounted(() => {
    themeObserver = new MutationObserver(() => {
      colors = {}
      if (ctx) options.layout?.({ ctx, width, height })
      render()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  })
  onBeforeUnmount(() => {
    stop()
    themeObserver?.disconnect()
  })
}

/** Converts `#rgb` / `#rrggbb` to an rgba() string; other formats are returned unchanged. */
export function withAlpha(color: string, alpha: number) {
  const hex = color.replace('#', '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return color
  const full = hex.length === 3 ? [...hex].map((char) => char + char).join('') : hex
  const value = Number.parseInt(full, 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}
