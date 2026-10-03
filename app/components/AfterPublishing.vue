<template>
  <section
    id="features"
    ref="root"
    class="landing-section after-section"
    :data-armed="armed || undefined"
    :data-seen="seen || undefined"
  >
    <canvas ref="canvas" class="after-canvas" aria-hidden="true" />
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.after.eyebrow') }}</p>
        <h2>{{ $t('landing.design.after.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.after.text') }}</p>
      </div>

      <ul class="after-grid">
        <li class="after-card after-search">
          <div class="after-visual" aria-hidden="true">
            <div class="after-visual-head">
              <span><Icon name="mdi:google" />Search Console</span>
              <span>{{ $t('landing.design.after.dashboard.range') }}</span>
            </div>
            <dl class="after-kpis">
              <div v-for="kpi in kpis" :key="kpi.label">
                <dt>{{ kpi.label }}</dt>
                <dd>
                  {{ kpi.value }}<small v-if="kpi.delta">{{ kpi.delta }}</small>
                </dd>
              </div>
            </dl>
            <div class="after-chart">
              <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" preserveAspectRatio="none">
                <path :d="area" class="after-chart-area" />
                <path :d="line" class="after-chart-line" />
              </svg>
              <span class="after-marker" :style="{ left: markerLeft }">
                <span>{{ $t('landing.design.after.dashboard.annotation') }}</span>
              </span>
            </div>
          </div>
          <div class="after-copy">
            <h3>{{ $t('landing.design.after.items.search.title') }}</h3>
            <p>{{ $t('landing.design.after.items.search.text') }}</p>
          </div>
        </li>

        <li class="after-card after-ai">
          <div class="after-visual" aria-hidden="true">
            <div class="after-visual-head">
              <span><span class="after-openai" />OpenAI</span>
            </div>
            <p class="after-metric">
              <strong>{{ $t('landing.design.after.dashboard.citedValue') }}</strong>
              <span>
                {{ $t('landing.design.after.dashboard.cited') }}
                <small>{{ $t('landing.design.after.dashboard.citedMeta') }}</small>
              </span>
            </p>
            <ul class="after-questions">
              <li v-for="(question, index) in questions" :key="question.text" :data-cited="cited[index] || undefined">
                <span class="after-dot" />
                <span>
                  {{ question.text }}
                  <small>{{ question.status }}</small>
                </span>
              </li>
            </ul>
          </div>
          <div class="after-copy">
            <h3>{{ $t('landing.design.after.items.ai.title') }}</h3>
            <p>{{ $t('landing.design.after.items.ai.text') }}</p>
          </div>
        </li>

        <li class="after-card after-opportunities">
          <div class="after-visual" aria-hidden="true">
            <div class="after-visual-head">
              <span
                ><Icon name="mdi:lightbulb-on-outline" />{{
                  $t('landing.design.after.dashboard.opportunitiesLabel')
                }}</span
              >
            </div>
            <ul class="after-list">
              <li v-for="opportunity in opportunities" :key="opportunity.query">
                <Icon name="mdi:lightbulb-outline" />
                <span>
                  <strong>{{ opportunity.query }}</strong>
                  <small>{{ opportunity.meta }}</small>
                </span>
                <span class="mock-btn">{{ opportunity.action }}</span>
              </li>
            </ul>
          </div>
          <div class="after-copy">
            <h3>{{ $t('landing.design.after.items.opportunities.title') }}</h3>
            <p>{{ $t('landing.design.after.items.opportunities.text') }}</p>
          </div>
        </li>

        <li class="after-card after-autopilot">
          <div class="after-visual" aria-hidden="true">
            <div class="after-visual-head">
              <span><Icon name="mdi:autorenew" />{{ $t('landing.design.after.dashboard.autopilot') }}</span>
              <span class="mock-toggle" data-on />
            </div>
            <ol class="after-log">
              <li v-for="entry in log" :key="entry.title">
                <span class="after-log-icon"><Icon name="mdi:history" /></span>
                <span>
                  <strong>{{ entry.title }}</strong>
                  <small>{{ entry.detail }} · {{ entry.when }}</small>
                </span>
                <span class="mock-btn"><Icon name="mdi:undo" />{{ $t('landing.design.after.dashboard.revert') }}</span>
              </li>
            </ol>
          </div>
          <div class="after-copy">
            <h3>{{ $t('landing.design.after.items.autopilot.title') }}</h3>
            <p>{{ $t('landing.design.after.items.autopilot.text') }}</p>
          </div>
        </li>
      </ul>
      <p class="after-plan">{{ $t('landing.design.after.plan') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const kpis = useMessageList<'label' | 'value' | 'delta'>('landing.design.after.dashboard.kpis')
const questions = useMessageList<'text' | 'status'>('landing.design.after.dashboard.questions')
const opportunities = useMessageList<'query' | 'meta' | 'action'>('landing.design.after.dashboard.opportunities')
const log = useMessageList<'title' | 'detail' | 'when'>('landing.design.after.dashboard.log')
const cited = [true, false, true]

// Daily clicks for the illustrative chart; the autopilot title change lands on day 17.
const clicks = [
  22, 26, 24, 29, 27, 31, 25, 28, 30, 27, 33, 29, 31, 34, 30, 32, 35, 41, 46, 44, 52, 49, 55, 58, 54, 61, 63, 66,
]
const changeDay = 17
const chart = { width: 560, height: 150, top: 12 }
const max = Math.max(...clicks)
const points = clicks.map((value, index) => [
  (index / (clicks.length - 1)) * chart.width,
  chart.top + (1 - value / max) * (chart.height - chart.top),
])
const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x!.toFixed(1)} ${y!.toFixed(1)}`).join(' ')
const area = `${line} L${chart.width} ${chart.height} L0 ${chart.height} Z`
const marker = points[changeDay]!
const markerLeft = `${(marker[0]! / chart.width) * 100}%`

// The chart draws in once it scrolls into view; without JavaScript it is simply shown.
const root = useTemplateRef<HTMLElement>('root')
const armed = useMounted()
const seen = shallowRef(false)
useIntersectionObserver(
  root,
  ([entry]) => {
    if (entry?.isIntersecting) seen.value = true
  },
  { threshold: 0.2 },
)

// Background: a field of search queries that the cursor lights up like a torch.
const queries = useMessageStrings('landing.design.after.queries')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const font = '500 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const torch = 260
let field: { x: number; y: number; text: string; width: number }[] = []

useCursorCanvas(root, canvas, {
  layout({ ctx, width, height }) {
    ctx.font = font
    field = []
    const list = queries.value
    let next = 0
    for (let row = 0, y = 28; y < height; row++, y += 38) {
      let x = -((row * 157) % 280)
      while (x < width) {
        const text = list[next++ % list.length]!
        const textWidth = ctx.measureText(text).width
        field.push({ x, y, text, width: textWidth })
        x += textWidth + 44
      }
    }
  },
  draw({ ctx, x, y, strength, color }) {
    ctx.font = font
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color('--landing-muted')
    ctx.globalAlpha = 0.075
    for (const item of field) ctx.fillText(item.text, item.x, item.y)
    if (strength > 0.01) {
      const accent = color('--landing-accent')
      const pool = ctx.createRadialGradient(x, y, 0, x, y, torch * 1.4)
      pool.addColorStop(0, withAlpha(accent, 0.09 * strength))
      pool.addColorStop(1, withAlpha(accent, 0))
      ctx.globalAlpha = 1
      ctx.fillStyle = pool
      ctx.fillRect(x - torch * 1.4, y - torch * 1.4, torch * 2.8, torch * 2.8)
      ctx.fillStyle = accent
      for (const item of field) {
        const dx = item.x + item.width / 2 - x
        const dy = item.y - y
        const distance = Math.sqrt(dx * dx + dy * dy) - item.width / 3
        if (distance >= torch) continue
        const light = 1 - Math.max(distance, 0) / torch
        ctx.globalAlpha = light * light * strength
        ctx.fillText(item.text, item.x, item.y)
      }
    }
    ctx.globalAlpha = 1
  },
})

// Card borders catch the same light; each card gets the cursor in its own coordinates.
let cardFrame = 0
useEventListener(root, 'pointermove', (event: PointerEvent) => {
  if (event.pointerType === 'touch' || cardFrame) return
  cardFrame = requestAnimationFrame(() => {
    cardFrame = 0
    for (const card of root.value?.querySelectorAll<HTMLElement>('.after-card') ?? []) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
  })
})
onBeforeUnmount(() => cancelAnimationFrame(cardFrame))
</script>

<style scoped>
/* Follows the page theme like the other sections; the cards sit on the page background. */
.after-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--landing-bg);
  color: var(--landing-ink);
}
.after-canvas {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Keep the heading copy on a clean background. */
  mask-image: radial-gradient(ellipse 720px 260px at 22% 150px, transparent 35%, #000 85%);
}
.after-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.after-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  box-shadow: 0 0 0 6px var(--landing-bg);
}
.after-card::before {
  content: '';
  position: absolute;
  z-index: 1;
  inset: -1px;
  padding: 1px;
  border-radius: inherit;
  background: radial-gradient(
    360px circle at var(--mx, -999px) var(--my, -999px),
    color-mix(in srgb, var(--landing-accent) 85%, transparent),
    transparent 70%
  );
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.after-section:hover .after-card::before {
  opacity: 1;
}
.after-search,
.after-autopilot {
  grid-column: span 7;
}
.after-ai,
.after-opportunities {
  grid-column: span 5;
}
.after-visual {
  flex: 1;
  padding: 20px 22px;
  font-size: 13px;
}
.after-copy {
  padding: 18px 22px 22px;
  border-top: 1px solid var(--landing-line);
}
.after-copy h3 {
  margin-bottom: 6px;
  font-size: 17px;
  font-weight: 700;
}
.after-copy p {
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
.after-visual-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--landing-muted);
  font-size: 12px;
}
.after-visual-head > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--landing-ink);
  font-weight: 650;
}
.after-visual-head .iconify {
  color: var(--landing-accent);
  font-size: 16px;
}
/* The OpenAI mark as a mask, so it takes the heading colour like the wordmark next to it. */
.after-openai {
  flex: none;
  width: 16px;
  height: 16px;
  background: currentColor;
  mask: url('/brand/products/openai.svg') center / contain no-repeat;
}
.after-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 14px;
}
.after-kpis dt {
  color: var(--landing-muted);
  font-size: 11px;
}
.after-kpis dd {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 6px;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.after-kpis small {
  color: var(--landing-success);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
}
.after-chart {
  position: relative;
  height: 150px;
}
.after-chart svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.after-chart-area {
  fill: color-mix(in srgb, var(--landing-accent) 14%, transparent);
}
.after-chart-line {
  fill: none;
  stroke: var(--landing-accent);
  stroke-width: 2;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
.after-section[data-armed] .after-chart svg {
  clip-path: inset(0 100% 0 0);
}
.after-section[data-armed] .after-marker {
  opacity: 0;
}
.after-section[data-seen] .after-chart svg {
  animation: after-draw 1.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.after-section[data-seen] .after-marker {
  animation: after-fade 0.4s 1.1s ease-out forwards;
}
.after-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed color-mix(in srgb, var(--landing-accent) 70%, transparent);
}
.after-marker > span {
  position: absolute;
  top: -4px;
  right: 8px;
  padding: 3px 8px;
  border: 1px solid var(--landing-line);
  border-radius: 6px;
  background: var(--landing-bg);
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}
.after-metric {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px !important;
}
.after-metric strong {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
}
.after-metric > span {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 650;
}
.after-metric small {
  color: var(--landing-muted);
  font-weight: 500;
}
.after-questions,
.after-list,
.after-log {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
.after-questions li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid var(--landing-line);
  font-size: 12px;
  line-height: 1.45;
}
.after-questions li > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.after-questions small {
  color: var(--landing-muted);
  font-size: 11px;
}
.after-questions [data-cited] small {
  color: var(--landing-success);
}
.after-dot {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--landing-line);
}
[data-cited] .after-dot {
  background: var(--landing-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--landing-success) 20%, transparent);
}
.after-list li,
.after-log li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--landing-line);
}
.after-list li:first-child,
.after-log li:first-child {
  border-top: 0;
  padding-top: 0;
}
.after-list li > .iconify {
  flex: none;
  color: var(--landing-accent);
  font-size: 18px;
}
.after-list li > span:nth-child(2),
.after-log li > span:nth-child(2) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 13px;
}
.after-list small,
.after-log small {
  color: var(--landing-muted);
  font-size: 11px;
}
.after-log-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 16px;
}
.after-plan {
  margin-top: 20px !important;
  color: var(--landing-muted);
  font-size: 12px;
}
@keyframes after-draw {
  to {
    clip-path: inset(0 -2% 0 0);
  }
}
@keyframes after-fade {
  to {
    opacity: 1;
  }
}
@media (max-width: 1000px) {
  .after-search,
  .after-autopilot,
  .after-ai,
  .after-opportunities {
    grid-column: 1 / -1;
  }
}
@media (max-width: 600px) {
  .after-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .after-visual,
  .after-copy {
    padding-inline: 18px;
  }
  .after-list .mock-btn,
  .after-log .mock-btn {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .after-section[data-armed] .after-chart svg,
  .after-section[data-armed] .after-marker {
    clip-path: none;
    opacity: 1;
    animation: none;
  }
}
</style>
