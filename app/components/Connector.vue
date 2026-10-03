<template>
  <section class="landing-section connector-section">
    <div class="landing-container connector-grid">
      <div class="section-heading connector-heading">
        <p class="eyebrow">{{ $t('landing.design.connector.eyebrow') }}</p>
        <h2>{{ $t('landing.design.connector.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.connector.text') }}</p>
      </div>

      <div
        ref="frame"
        class="connector-frame"
        :data-layout="layoutName"
        :style="{ height: `${layout.height * scale}px` }"
        role="img"
        :aria-label="$t('landing.design.connector.label')"
      >
        <div
          class="connector-stage"
          :data-ready="ready || undefined"
          :style="{ width: `${layout.width}px`, height: `${layout.height}px`, transform: `scale(${scale})` }"
        >
          <svg
            ref="svg"
            class="connector-wires"
            :viewBox="`0 0 ${layout.width} ${layout.height}`"
            :width="layout.width"
            :height="layout.height"
            aria-hidden="true"
          >
            <path
              v-for="(wire, index) in wires"
              :key="`wire-${index}`"
              :d="wire"
              class="connector-wire"
              :data-active="hovered === index || undefined"
            />
            <path :d="outputWire" class="connector-wire connector-wire-out" />
            <template v-if="animated">
              <circle v-for="(wire, index) in wires" :key="`dot-${index}`" r="3.5" class="connector-dot">
                <animateMotion
                  :dur="`${2.6 + (index % 3) * 0.5}s`"
                  :begin="`${-index * 0.45}s`"
                  repeatCount="indefinite"
                  :path="wire"
                />
              </circle>
              <circle v-for="dot in 3" :key="`out-${dot}`" r="4.5" class="connector-dot connector-dot-out">
                <animateMotion dur="1.8s" :begin="`${-dot * 0.6}s`" repeatCount="indefinite" :path="outputWire" />
              </circle>
            </template>
          </svg>

          <div
            v-for="(fragment, index) in fragments"
            :key="fragment.kind"
            class="connector-fragment"
            :data-kind="fragment.kind"
            :data-active="hovered === index || undefined"
            :style="fragmentStyle(fragment)"
            @pointerenter="hovered = index"
            @pointerleave="hovered = null"
          >
            <span class="connector-source">{{ $t(`landing.design.connector.sources.${fragment.source}`) }}</span>
            <template v-if="fragment.kind === 'search'">
              <span class="connector-url"><span class="connector-favicon" />{{ c('search.url') }}</span>
              <strong class="connector-link">{{ c('search.title') }}</strong>
              <span class="connector-bar" style="width: 92%" />
              <span class="connector-bar" style="width: 70%" />
            </template>
            <template v-else-if="fragment.kind === 'pdf'">
              <span class="connector-file">
                <Icon name="mdi:file-pdf-box" />
                <span
                  ><strong>{{ c('pdf.name') }}</strong
                  ><small>{{ c('pdf.meta') }}</small></span
                >
              </span>
            </template>
            <template v-else-if="fragment.kind === 'forum'">
              <span class="connector-forum">
                <span class="connector-avatar" />
                <span>{{ c('forum.text') }}</span>
              </span>
              <small>{{ c('forum.meta') }}</small>
            </template>
            <template v-else-if="fragment.kind === 'colors'">
              <span class="connector-swatches">
                <span v-for="swatch in swatches" :key="swatch" :style="{ background: swatch }" />
                <span class="connector-type">Aa</span>
              </span>
              <strong>{{ c('colors.name') }}</strong>
              <small>{{ c('colors.meta') }}</small>
            </template>
            <template v-else-if="fragment.kind === 'sheet'">
              <table class="connector-sheet">
                <thead>
                  <tr>
                    <th v-for="cell in sheet.head" :key="cell">{{ cell }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in sheet.rows" :key="row[0]">
                    <td v-for="cell in row" :key="cell">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-else-if="fragment.kind === 'tone'">
              <strong>{{ c('tone.title') }}</strong>
              <span class="connector-quote">{{ c('tone.text') }}</span>
            </template>
            <template v-else-if="fragment.kind === 'query'">
              <span class="connector-file">
                <Icon name="mdi:google" />
                <span
                  ><strong>{{ c('query.text') }}</strong
                  ><small>{{ c('query.meta') }}</small></span
                >
              </span>
            </template>
            <template v-else>
              <span class="connector-note">{{ c('notes.text') }}</span>
            </template>
          </div>

          <div class="connector-hub" :style="hubStyle">
            <span class="connector-ring" />
            <span class="connector-ring" />
            <span class="connector-logo">
              <img src="/brand/topiqu-mark.png" width="64" height="67" alt="" />
            </span>
          </div>

          <article class="connector-article" :style="articleStyle">
            <span class="connector-article-bar" />
            <div class="connector-article-body">
              <p class="connector-article-category">{{ c('article.category') }}</p>
              <p class="connector-article-title mock-serif">{{ $t('landing.design.showcase.mock.article') }}</p>
              <p class="connector-article-meta">{{ c('article.meta') }}</p>
              <p class="connector-article-section mock-serif">{{ c('article.section') }}</p>
              <p class="connector-article-text mock-serif">{{ c('article.paragraph') }}</p>
              <ul>
                <li v-for="chip in chips" :key="chip"><Icon name="mdi:check" />{{ chip }}</li>
              </ul>
            </div>
            <p class="connector-output"><Icon name="mdi:check-decagram" />{{ c('output') }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Kind = 'search' | 'pdf' | 'forum' | 'colors' | 'sheet' | 'tone' | 'query' | 'notes'
type Source = 'web' | 'data' | 'brand' | 'search'
interface Placement {
  x: number
  y: number
  w: number
  h: number
  r: number
}
interface Fragment {
  kind: Kind
  source: Source
  wide: Placement
  tall: Placement
}

const { t, locale } = useI18n()
const c = (key: string) => t(`landing.design.connector.${key}`)
const chips = useMessageStrings('landing.design.connector.article.chips')
const swatches = ['#0d9488', '#0f172a', '#f59e0b', '#e2e8f0']
const sheet = computed(() =>
  locale.value === 'cs'
    ? {
        head: ['Model', 'Výkon', 'Cena'],
        rows: [
          ['HW-8', '8 kW', '189 000 Kč'],
          ['HW-12', '12 kW', '236 000 Kč'],
        ],
      }
    : {
        head: ['Model', 'Output', 'Price'],
        rows: [
          ['HW-8', '8 kW', '$7,900'],
          ['HW-12', '12 kW', '$9,800'],
        ],
      },
)

// Two hand-placed compositions: `wide` (900 × 540) and `tall` (400 × 1040). Wires are computed from the same
// numbers, so they always meet the fragments regardless of how the stage is scaled.
const layouts = {
  wide: { width: 900, height: 540, hub: { x: 492, y: 270, size: 96 }, article: { x: 584, y: 52, w: 316, h: 436 } },
  tall: { width: 400, height: 1040, hub: { x: 200, y: 640, size: 104 }, article: { x: 16, y: 728, w: 368, h: 300 } },
} as const
const fragments: Fragment[] = [
  {
    kind: 'search',
    source: 'web',
    wide: { x: 0, y: 14, w: 222, h: 108, r: -4 },
    tall: { x: 8, y: 0, w: 220, h: 104, r: -4 },
  },
  {
    kind: 'pdf',
    source: 'data',
    wide: { x: 232, y: 36, w: 194, h: 78, r: 5 },
    tall: { x: 214, y: 34, w: 180, h: 78, r: 5 },
  },
  {
    kind: 'forum',
    source: 'web',
    wide: { x: 10, y: 146, w: 210, h: 112, r: 3 },
    tall: { x: 4, y: 130, w: 200, h: 112, r: 3 },
  },
  {
    kind: 'colors',
    source: 'brand',
    wide: { x: 240, y: 150, w: 170, h: 104, r: -6 },
    tall: { x: 222, y: 140, w: 170, h: 104, r: -6 },
  },
  {
    kind: 'sheet',
    source: 'data',
    wide: { x: 0, y: 284, w: 228, h: 112, r: -2 },
    tall: { x: 10, y: 268, w: 230, h: 112, r: -2 },
  },
  {
    kind: 'tone',
    source: 'brand',
    wide: { x: 244, y: 292, w: 168, h: 104, r: 4 },
    tall: { x: 232, y: 276, w: 160, h: 100, r: 4 },
  },
  {
    kind: 'query',
    source: 'search',
    wide: { x: 14, y: 428, w: 212, h: 82, r: 2 },
    tall: { x: 16, y: 410, w: 210, h: 82, r: 2 },
  },
  {
    kind: 'notes',
    source: 'data',
    wide: { x: 242, y: 420, w: 168, h: 110, r: -5 },
    tall: { x: 226, y: 404, w: 166, h: 110, r: -5 },
  },
]

const frame = useTemplateRef<HTMLElement>('frame')
const { width: frameWidth } = useElementSize(frame)
const ready = computed(() => frameWidth.value > 0)
const layoutName = computed<'wide' | 'tall'>(() => (frameWidth.value && frameWidth.value < 520 ? 'tall' : 'wide'))
const layout = computed(() => layouts[layoutName.value])
const scale = computed(() => (frameWidth.value ? frameWidth.value / layout.value.width : 1))

const place = (fragment: Fragment) => fragment[layoutName.value]
const fragmentStyle = (fragment: Fragment) => {
  const { x, y, w, h, r } = place(fragment)
  return { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, '--r': `${r}deg` }
}
const hubStyle = computed(() => {
  const { x, y, size } = layout.value.hub
  return { left: `${x - size / 2}px`, top: `${y - size / 2}px`, width: `${size}px`, height: `${size}px` }
})
const articleStyle = computed(() => {
  const { x, y, w, h } = layout.value.article
  return { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` }
})

// Each wire leaves its fragment (right edge when wide, bottom edge when tall) and curves into the hub.
const wires = computed(() => {
  const { hub } = layout.value
  return fragments.map((fragment) => {
    const { x, y, w, h } = place(fragment)
    if (layoutName.value === 'wide') {
      const sx = x + w
      const sy = y + h / 2
      const ex = hub.x - hub.size / 2
      const bend = Math.max(36, (ex - sx) * 0.5)
      return `M${sx} ${sy} C${sx + bend} ${sy}, ${ex - bend} ${hub.y}, ${ex} ${hub.y}`
    }
    const sx = x + w / 2
    const sy = y + h
    const ey = hub.y - hub.size / 2
    const bend = Math.max(30, (ey - sy) * 0.5)
    return `M${sx} ${sy} C${sx} ${sy + bend}, ${hub.x} ${ey - bend}, ${hub.x} ${ey}`
  })
})
const outputWire = computed(() => {
  const { hub, article } = layout.value
  return layoutName.value === 'wide'
    ? `M${hub.x + hub.size / 2} ${hub.y} L${article.x} ${hub.y}`
    : `M${hub.x} ${hub.y + hub.size / 2} L${hub.x} ${article.y}`
})

const hovered = shallowRef<number | null>(null)

// Particles run only while the section is visible and motion is allowed.
const svg = useTemplateRef<SVGSVGElement>('svg')
const visible = useElementVisibility(frame)
const reducedMotion = usePreferredReducedMotion()
const mounted = useMounted()
const animated = computed(() => mounted.value && reducedMotion.value !== 'reduce')
watch([visible, animated, svg], () => {
  if (!svg.value) return
  if (visible.value) svg.value.unpauseAnimations()
  else svg.value.pauseAnimations()
})
</script>

<style scoped>
.connector-section {
  overflow: hidden;
  background: var(--landing-surface);
}
/* The diagram leads and the copy sits beside it, mirroring the showcase above (copy left, product right). */
.connector-grid {
  display: grid;
  grid-template-areas: 'stage heading';
  grid-template-columns: minmax(0, 7.4fr) minmax(0, 4.6fr);
  gap: 64px;
  align-items: center;
}
.connector-heading {
  grid-area: heading;
  margin-bottom: 0;
}
.connector-frame {
  position: relative;
  grid-area: stage;
}
@media (max-width: 1000px) {
  .connector-grid {
    grid-template-areas: 'heading' 'stage';
    grid-template-columns: minmax(0, 1fr);
    gap: 38px;
  }
}
.connector-stage {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transform-origin: top left;
  transition: opacity 0.4s;
}
.connector-stage[data-ready] {
  opacity: 1;
}
.connector-wires {
  position: absolute;
  inset: 0;
  overflow: visible;
}
.connector-wire {
  fill: none;
  stroke: color-mix(in srgb, var(--landing-accent) 28%, var(--landing-line));
  stroke-width: 1.5;
  stroke-dasharray: 4 6;
  transition:
    stroke 0.2s,
    stroke-width 0.2s;
}
.connector-wire[data-active] {
  stroke: var(--landing-accent);
  stroke-width: 2.5;
  stroke-dasharray: none;
}
.connector-wire-out {
  stroke: var(--landing-accent);
  stroke-width: 2.5;
  stroke-dasharray: none;
}
.connector-dot {
  fill: var(--landing-accent);
  opacity: 0.75;
}
.connector-dot-out {
  opacity: 1;
}

/* Input fragments: deliberately varied, slightly rotated scraps. */
.connector-fragment {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 14px;
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
  box-shadow: 0 14px 30px -20px #0f172a59;
  color: var(--landing-ink);
  font-size: 12px;
  line-height: 1.4;
  rotate: var(--r);
  transition:
    rotate 0.3s,
    translate 0.3s,
    box-shadow 0.3s,
    border-color 0.3s;
}
.connector-fragment[data-active] {
  rotate: 0deg;
  translate: 0 -4px;
  border-color: var(--landing-accent);
  box-shadow: 0 20px 40px -22px color-mix(in srgb, var(--landing-accent) 60%, #0f172a);
}
.connector-fragment small {
  color: var(--landing-muted);
  font-size: 11px;
}
.connector-source {
  color: var(--landing-muted);
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.connector-url {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--landing-muted);
  font-size: 11px;
}
.connector-favicon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--landing-success-tint);
  box-shadow: inset 0 0 0 3px var(--landing-success);
}
.connector-link {
  color: #1a4fd6;
  font-size: 14px;
  font-weight: 600;
}
:global(.dark) .connector-link {
  color: #8ab4f8;
}
.connector-bar {
  height: 6px;
  border-radius: 999px;
  background: var(--landing-line);
}
.connector-file {
  display: flex;
  align-items: center;
  gap: 10px;
}
.connector-file .iconify {
  flex: none;
  font-size: 30px;
}
.connector-fragment[data-kind='pdf'] .iconify {
  color: #dc2626;
}
.connector-fragment[data-kind='query'] .iconify {
  color: var(--landing-accent);
  font-size: 24px;
}
.connector-file > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.connector-file strong {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.connector-forum {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
}
.connector-avatar {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ec4899);
}
.connector-swatches {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.connector-swatches span:not(.connector-type) {
  width: 22px;
  height: 22px;
  border: 1px solid var(--landing-line);
  border-radius: 6px;
}
.connector-type {
  margin-left: 4px;
  font-family: var(--topiqu-font-reading);
  font-size: 20px;
  font-weight: 600;
}
.connector-sheet {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.connector-sheet th,
.connector-sheet td {
  padding: 4px 6px;
  border: 1px solid var(--landing-line);
  text-align: left;
  white-space: nowrap;
}
.connector-sheet th {
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-weight: 700;
}
.connector-quote {
  font-family: var(--topiqu-font-reading);
  font-size: 14px;
  font-style: italic;
}
.connector-fragment[data-kind='notes'] {
  border-color: color-mix(in srgb, var(--landing-warn) 30%, var(--landing-line));
  background: var(--landing-warn-tint);
}
.connector-note {
  font-size: 13px;
  font-weight: 600;
}

/* Hub: the Topiqu mark with two slow pulses. */
.connector-hub {
  position: absolute;
  display: grid;
  place-items: center;
}
.connector-logo {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid var(--landing-line);
  border-radius: 30px;
  /* White in both themes: the mark is drawn for a light background. */
  background: #fff;
  box-shadow:
    0 0 0 8px color-mix(in srgb, var(--landing-accent) 8%, transparent),
    0 24px 48px -20px color-mix(in srgb, var(--landing-accent) 60%, #0f172a);
}
.connector-logo img {
  width: 52%;
  height: auto;
}
.connector-ring {
  position: absolute;
  inset: 0;
  border: 1.5px solid var(--landing-accent);
  border-radius: 30px;
  opacity: 0;
  animation: connector-pulse 3.2s ease-out infinite;
}
.connector-ring:nth-child(2) {
  animation-delay: 1.6s;
}

/* Output: one clean article. */
.connector-article {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 16px;
  background: var(--landing-surface);
  box-shadow:
    0 1px 2px #0f172a0d,
    0 32px 64px -36px color-mix(in srgb, var(--landing-accent) 55%, #0f172a);
}
.connector-article-bar {
  height: 6px;
  background: #0d9488;
}
.connector-article-body {
  flex: 1;
  padding: 24px 28px 0;
}
.connector-article-category {
  margin-bottom: 8px !important;
  color: #0d9488;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.12em;
}
.connector-article-title {
  font-size: 25px;
  font-weight: 550;
  line-height: 1.2;
  text-wrap: balance;
}
.connector-article-meta {
  margin-top: 8px !important;
  color: var(--landing-muted);
  font-size: 12px;
}
.connector-article-section {
  margin-top: 18px !important;
  font-size: 17px;
  font-weight: 600;
}
.connector-article-text {
  margin-top: 6px !important;
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.6;
}
.connector-article ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.connector-article li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--landing-success-tint);
  color: var(--landing-success);
  font-size: 11px;
  font-weight: 700;
}
.connector-output {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0 !important;
  padding: 12px 28px;
  border-top: 1px solid var(--landing-line);
  background: var(--landing-bg);
  font-size: 13px;
  font-weight: 700;
}
.connector-output .iconify {
  color: var(--landing-accent);
  font-size: 18px;
}
.connector-frame[data-layout='tall'] .connector-article-body {
  padding: 18px 20px 0;
}
.connector-frame[data-layout='tall'] .connector-article-title {
  font-size: 21px;
}
.connector-frame[data-layout='tall'] .connector-article-section,
.connector-frame[data-layout='tall'] .connector-article-text {
  display: none;
}
.connector-frame[data-layout='tall'] .connector-output {
  padding-inline: 20px;
}
@keyframes connector-pulse {
  from {
    opacity: 0.6;
    scale: 1;
  }
  to {
    opacity: 0;
    scale: 1.6;
  }
}
@media (prefers-reduced-motion: reduce) {
  .connector-ring {
    animation: none;
  }
  .connector-fragment {
    transition: none;
  }
}
</style>
