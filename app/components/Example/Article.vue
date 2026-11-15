<template>
  <div
    ref="paper"
    class="example-paper"
    :class="{ 'is-plain': plain, 'is-compact': compact, 'is-framed': framed, 'is-placed': wide && placed }"
    :style="{ '--brand': data.example.brand }"
  >
    <div ref="page" class="example-page">
      <slot name="head" />
      <!-- eslint-disable-next-line vue/no-v-html -- a static, reviewed snapshot of our own published article -->
      <div
        ref="body"
        class="example-text"
        @click="pick"
        @keydown.enter="pick"
        @mouseover="hover"
        @focusin="hover"
        v-html="data.snapshot.content"
      />
      <slot name="foot" />
    </div>
    <div v-if="!plain" class="example-margin">
      <p v-if="compact" class="example-margin-head">
        <img src="/brand/topiqu-mark.webp" alt="" width="20" height="20" />{{ $t('landing.examples.guideTitle') }}
      </p>
      <ol
        ref="rail"
        class="example-rail"
        :style="wide ? { minHeight: `${railHeight}px` } : undefined"
        :aria-label="$t('landing.examples.notesLabel')"
        @transitionend="redraw"
      >
        <li
          v-for="(note, index) in data.notes"
          :id="`note-${index + 1}`"
          :key="note.quote"
          :style="wide && placed ? { top: `${tops[index]}px` } : undefined"
          @mouseenter="active = index + 1"
          @focusin="active = index + 1"
        >
          <ExampleNote
            :note
            :number="index + 1"
            :example="data.example"
            :active="active === index + 1"
            :brief="compact"
          />
        </li>
      </ol>
    </div>
    <div v-if="!plain && !wide && !compact && sheet" class="example-sheet" role="region" aria-live="polite">
      <ExampleNote :note="sheet" :number="active" :example="data.example" active />
      <UButton
        icon="mdi:close"
        color="neutral"
        variant="ghost"
        class="example-sheet-close"
        :aria-label="$t('landing.examples.closeNote')"
        @click="active = 0"
      />
    </div>
    <svg v-if="link" class="example-link" aria-hidden="true">
      <path :d="link.path" />
      <circle :cx="link.x1" :cy="link.y1" r="3.5" />
      <circle :cx="link.x2" :cy="link.y2" r="3.5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { LoadedExample } from '~/composables/useExample'

/** `compact` is the homepage excerpt; `framed` draws the article as a page of the company blog. */
const props = defineProps<{ data: LoadedExample; plain?: boolean; compact?: boolean; framed?: boolean }>()
const active = defineModel<number>('active', { default: 0 })

const paper = useTemplateRef<HTMLElement>('paper')
const page = useTemplateRef<HTMLElement>('page')
const body = useTemplateRef<HTMLElement>('body')
const rail = useTemplateRef<HTMLElement>('rail')
const wide = useMediaQuery('(min-width: 1080px)')
const tops = shallowRef<number[]>([])
const railHeight = shallowRef(0)
const placed = shallowRef(false)
const link = shallowRef<{ x1: number; y1: number; x2: number; y2: number; path: string } | null>(null)
const sheet = computed(() => props.data.notes[active.value - 1])

const marks = () => [...(body.value?.querySelectorAll<HTMLElement>('mark[data-note]') ?? [])]
const noteOf = (target: EventTarget | null) =>
  Number((target as HTMLElement | null)?.closest<HTMLElement>('mark[data-note]')?.dataset.note ?? 0)

const hover = (event: Event) => {
  const note = noteOf(event.target)
  if (note && wide.value) active.value = note
}
const pick = (event: Event) => {
  const note = noteOf(event.target)
  if (!note) return
  active.value = note
  if (wide.value) document.getElementById(`note-${note}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

// Each note sits beside its sentence, pushed down when the note above is still in the way.
// The homepage excerpt is short, so its notes stack at the top of the margin instead.
const place = () => {
  const root = body.value
  if (!root || !rail.value || !wide.value || props.plain || props.compact) return (placed.value = false)
  const origin = rail.value.getBoundingClientRect().top
  let bottom = 0
  const items = [...rail.value.children] as HTMLElement[]
  tops.value = props.data.notes.map((_, index) => {
    const mark = root.querySelector<HTMLElement>(`mark[data-note="${index + 1}"]`)
    // 12 px up puts the note's avatar level with the first line of its sentence.
    const top = Math.max(mark ? mark.getBoundingClientRect().top - origin - 12 : bottom, bottom)
    bottom = top + (items[index]?.offsetHeight ?? 0) + 14
    return top
  })
  railHeight.value = bottom
  placed.value = true
}

// A line from the active sentence's edge of the page to its note; the sticky homepage margin moves on scroll.
const draw = () => {
  const line = body.value?.querySelector(`mark[data-note="${active.value}"]`)?.getClientRects()[0]
  const item = rail.value?.children[active.value - 1]
  const note = item?.getBoundingClientRect()
  const badge = item?.querySelector('.example-note-number')?.getBoundingClientRect()
  const edge = (props.framed ? page : body).value?.getBoundingClientRect().right
  if (!paper.value || !line || !note || !badge || edge === undefined || !wide.value || props.plain)
    return (link.value = null)
  const origin = paper.value.getBoundingClientRect()
  const [x1, y1] = [edge - origin.left, line.top + line.height / 2 - origin.top]
  const [x2, y2] = [note.left - origin.left, badge.top + badge.height / 2 - origin.top]
  const mid = (x1 + x2) / 2
  link.value = { x1, y1, x2, y2, path: `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}` }
}
let frame = 0
const redraw = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(draw)
}
const layout = () => {
  place()
  redraw()
}

useResizeObserver(page, layout)
useEventListener('scroll', redraw, { passive: true })
watch(active, redraw)
watch([wide, () => props.plain, () => props.data], () => nextTick(layout))
onMounted(() => {
  for (const mark of marks()) mark.tabIndex = 0
  nextTick(layout)
})
onBeforeUnmount(() => cancelAnimationFrame(frame))
watchEffect(() => {
  for (const mark of marks()) mark.classList.toggle('is-active', Number(mark.dataset.note) === active.value)
})
</script>

<style scoped>
.example-paper {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
}
@media (min-width: 1080px) {
  .example-paper:not(.is-plain) {
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 40px;
  }
  .example-paper.is-compact:not(.is-plain) {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 36px;
  }
  /* Below the sticky site header. */
  .is-compact:not(.is-plain) .example-margin {
    position: sticky;
    top: 96px;
    align-self: start;
  }
}
/* On narrow screens a tapped mark opens its note in a sheet; the homepage keeps its three notes below the text. */
@media (max-width: 1079px) {
  .example-paper:not(.is-compact) .example-margin {
    display: none;
  }
}
.example-margin-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px !important;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--landing-line);
  font-size: 15px;
  font-weight: 750;
}
.example-margin-head img {
  width: 20px;
  height: 20px;
}
.example-text {
  max-width: 680px;
  font-family: var(--topiqu-font-reading);
  font-size: 18px;
  line-height: 1.75;
  color: var(--landing-ink);
}
.is-compact .example-text {
  font-size: 16.5px;
}
.is-framed .example-page {
  --page-pad: clamp(20px, 3.4vw, 40px);
  align-self: start;
  padding: var(--page-pad);
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  box-shadow: 0 30px 60px -48px color-mix(in srgb, var(--landing-ink) 55%, transparent);
}
.example-text :deep(h2) {
  margin: 2.2em 0 0.6em;
  font-family: inherit;
  font-size: 1.45em;
  line-height: 1.25;
  letter-spacing: -0.02em;
}
.example-text :deep(h3) {
  margin: 1.8em 0 0.5em;
  font-family: inherit;
  font-size: 1.15em;
  font-weight: 700;
  line-height: 1.3;
}
.example-text :deep(p),
.example-text :deep(ul) {
  margin: 0 0 1.1em;
}
.is-compact .example-text :deep(p + p)::before {
  content: '…';
  display: block;
  margin-bottom: 0.6em;
  color: var(--landing-muted);
}
.example-text :deep(ul) {
  padding-left: 1.3em;
}
/* The accent belongs to Topiqu's marks; the company's own links stay ink so the two never look alike. */
.example-text :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
  text-underline-offset: 3px;
}
.example-text :deep(a:hover) {
  text-decoration-color: currentColor;
}
.example-text :deep(figure) {
  margin: 1.8em 0;
}
.example-text :deep(img),
.example-text :deep(iframe) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-tint);
}
.example-text :deep(iframe) {
  aspect-ratio: 16 / 9;
  border: 0;
}
.example-text :deep(figcaption) {
  margin-top: 8px;
  font-family: var(--topiqu-font-ui, inherit);
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.5;
}
.example-text :deep(.example-mark) {
  padding: 1px 2px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--landing-accent) 14%, transparent);
  box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--landing-accent) 55%, transparent);
  color: inherit;
  cursor: pointer;
  transition: background 0.15s;
}
.example-text :deep(.example-mark::after) {
  content: attr(data-note);
  margin-left: 3px;
  vertical-align: super;
  color: var(--landing-accent);
  font-family: system-ui, sans-serif;
  font-size: 0.6em;
  font-weight: 750;
}
.example-text :deep(.example-mark.is-active) {
  background: color-mix(in srgb, var(--landing-accent) 28%, transparent);
}
.example-text :deep(.example-mark:focus-visible) {
  outline: 2px solid var(--landing-accent);
  outline-offset: 2px;
}
.is-plain .example-text :deep(.example-mark) {
  padding: 0;
  background: none;
  box-shadow: none;
  cursor: auto;
}
.is-plain .example-text :deep(.example-mark::after) {
  content: none;
}
.example-rail {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.example-rail {
  display: grid;
  align-content: start;
  gap: 12px;
}
.is-compact .example-rail {
  gap: 26px;
}
.is-placed .example-rail {
  display: block;
}
.is-placed .example-rail > li {
  position: absolute;
  inset-inline: 0;
  transition: top 0.2s;
}
.example-link {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  color: var(--landing-accent);
}
.example-link path {
  fill: none;
  stroke: currentColor;
  stroke-opacity: 0.5;
  stroke-width: 1.5;
}
.example-link circle {
  fill: var(--landing-surface);
  stroke: currentColor;
  stroke-width: 1.5;
}
.example-sheet {
  position: fixed;
  inset-inline: 12px;
  bottom: 12px;
  /* Above the scroll-to-top button. */
  z-index: 60;
  max-height: 60vh;
  overflow: auto;
  border-radius: var(--topiqu-control-radius);
  box-shadow: 0 18px 50px -12px color-mix(in srgb, var(--landing-ink) 45%, transparent);
}
.example-sheet-close {
  position: absolute;
  top: 6px;
  right: 6px;
}
@media (prefers-reduced-motion: reduce) {
  .is-placed .example-rail > li {
    transition: none;
  }
}
</style>
