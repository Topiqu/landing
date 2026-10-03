<template>
  <div ref="root" class="scene" :data-paused="!playing || undefined" aria-hidden="true">
    <div class="scene-tilt" :style="tilt">
      <div class="scene-plane">
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="scene-column"
          :style="{ '--duration': `${column.duration}s`, '--delay': `${column.delay}s` }"
        >
          <div class="scene-track">
            <article
              v-for="(card, cardIndex) in [...column.cards, ...column.cards]"
              :key="cardIndex"
              class="scene-card"
              :data-kind="card.kind"
            >
              <div v-if="card.kind === 'cover'" class="scene-cover"><HeroCover :variant="card.cover!" /></div>
              <svg
                v-else-if="card.kind === 'chart'"
                class="scene-chart"
                viewBox="0 0 200 70"
                preserveAspectRatio="none"
              >
                <path d="M0 58 L25 54 L50 56 L75 46 L100 48 L125 34 L150 30 L175 18 L200 10 L200 70 L0 70 Z" />
                <path d="M0 58 L25 54 L50 56 L75 46 L100 48 L125 34 L150 30 L175 18 L200 10" />
              </svg>
              <div class="scene-body">
                <span class="scene-tag" />
                <span class="scene-bar" style="width: 88%" />
                <span class="scene-bar" style="width: 64%" />
                <template v-if="card.kind === 'text'">
                  <span class="scene-bar scene-bar-thin" style="width: 92%" />
                  <span class="scene-bar scene-bar-thin" style="width: 78%" />
                  <span class="scene-bar scene-bar-thin" style="width: 84%" />
                </template>
                <span v-if="card.status" class="scene-chip" :data-tone="statuses[card.status].tone">
                  <Icon :name="statuses[card.status].icon" />{{ $t(`landing.design.hero.scene.${card.status}`) }}
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Cover = 'house' | 'radiator' | 'winter' | 'defrost'
type Status = 'verified' | 'published' | 'cited' | 'scheduled' | 'translated'
interface Card {
  kind: 'cover' | 'text' | 'chart'
  cover?: Cover
  status?: Status
}

const statuses: Record<Status, { icon: string; tone: 'ok' | 'accent' }> = {
  verified: { icon: 'mdi:shield-check-outline', tone: 'ok' },
  published: { icon: 'mdi:check-circle-outline', tone: 'ok' },
  cited: { icon: 'mdi:radar', tone: 'accent' },
  scheduled: { icon: 'mdi:clock-outline', tone: 'accent' },
  translated: { icon: 'mdi:translate', tone: 'accent' },
}

// Seven columns drifting towards the horizon at different speeds; each list is rendered twice for a seamless loop.
const columns: { duration: number; delay: number; cards: Card[] }[] = [
  {
    duration: 46,
    delay: -12,
    cards: [
      { kind: 'text', status: 'scheduled' },
      { kind: 'cover', cover: 'winter' },
      { kind: 'chart', status: 'cited' },
    ],
  },
  {
    duration: 38,
    delay: -30,
    cards: [
      { kind: 'cover', cover: 'house', status: 'published' },
      { kind: 'text' },
      { kind: 'cover', cover: 'defrost', status: 'translated' },
    ],
  },
  {
    duration: 52,
    delay: -4,
    cards: [
      { kind: 'chart' },
      { kind: 'cover', cover: 'radiator', status: 'verified' },
      { kind: 'text', status: 'published' },
    ],
  },
  {
    duration: 42,
    delay: -22,
    cards: [
      { kind: 'cover', cover: 'defrost', status: 'cited' },
      { kind: 'text', status: 'verified' },
      { kind: 'cover', cover: 'house' },
    ],
  },
  {
    duration: 50,
    delay: -36,
    cards: [
      { kind: 'text', status: 'translated' },
      { kind: 'chart', status: 'cited' },
      { kind: 'cover', cover: 'winter', status: 'published' },
    ],
  },
  {
    duration: 40,
    delay: -16,
    cards: [
      { kind: 'cover', cover: 'radiator', status: 'scheduled' },
      { kind: 'text' },
      { kind: 'chart', status: 'verified' },
    ],
  },
  {
    duration: 48,
    delay: -28,
    cards: [
      { kind: 'text', status: 'published' },
      { kind: 'cover', cover: 'house', status: 'cited' },
      { kind: 'text', status: 'scheduled' },
    ],
  },
]

const root = useTemplateRef<HTMLElement>('root')
const hero = useParentElement(root)
const visible = useElementVisibility(root)
const reducedMotion = usePreferredReducedMotion()
const touch = useMediaQuery('(hover: none)')
const playing = computed(() => visible.value && reducedMotion.value !== 'reduce')

// A gentle tilt towards the cursor; skipped on touch devices and with reduced motion.
const pointer = reactive({ x: 0, y: 0 })
const tilt = computed(() => ({ '--tilt-x': `${pointer.y * -3}deg`, '--tilt-y': `${pointer.x * 4}deg` }))
useEventListener(hero, 'pointermove', (event: PointerEvent) => {
  if (event.pointerType === 'touch' || touch.value || reducedMotion.value === 'reduce' || !hero.value) return
  const rect = hero.value.getBoundingClientRect()
  pointer.x = (event.clientX - rect.left) / rect.width - 0.5
  pointer.y = (event.clientY - rect.top) / rect.height - 0.5
})
useEventListener(hero, 'pointerleave', () => {
  pointer.x = 0
  pointer.y = 0
})
</script>

<style scoped>
/* `--band` is the strip below the hero copy that the floor occupies; the horizon sits just above it. */
.scene {
  --band: var(--hero-scene-band, 420px);
  --horizon: calc(100% - var(--band) + 24px);
  --pub-accent: var(--landing-accent);
  --pub-accent-soft: var(--landing-tint);
  --pub-surface: var(--landing-surface);
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  perspective: 1200px;
  perspective-origin: 50% var(--horizon);
  pointer-events: none;
  mask-image:
    linear-gradient(to bottom, transparent var(--horizon), #000 calc(var(--horizon) + 220px)),
    linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  mask-composite: intersect;
}
.scene-tilt {
  position: absolute;
  inset: 0;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transform-origin: 50% var(--horizon);
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.scene-plane {
  position: absolute;
  top: var(--horizon);
  left: 50%;
  display: grid;
  grid-template-columns: repeat(7, 220px);
  gap: 28px;
  height: 680px;
  overflow: hidden;
  transform: translateX(-50%) rotateX(60deg);
  transform-origin: 50% 0;
}
.scene-track {
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: scene-drift var(--duration) linear infinite;
  animation-delay: var(--delay);
  will-change: transform;
}
.scene[data-paused] .scene-track {
  animation-play-state: paused;
}
.scene-card {
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 14px;
  background: var(--landing-surface);
  box-shadow: 0 18px 40px -24px color-mix(in srgb, var(--landing-accent) 45%, #0f172a);
}
.scene-cover {
  height: 112px;
}
.scene-chart {
  display: block;
  width: 100%;
  height: 84px;
  padding: 14px 14px 0;
}
.scene-chart path:first-child {
  fill: color-mix(in srgb, var(--landing-accent) 14%, transparent);
}
.scene-chart path:last-child {
  fill: none;
  stroke: var(--landing-accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
.scene-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
}
.scene-tag {
  width: 46px;
  height: 14px;
  border-radius: 999px;
  background: var(--landing-tint);
}
.scene-bar {
  height: 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--landing-ink) 16%, transparent);
}
.scene-bar-thin {
  height: 6px;
  background: color-mix(in srgb, var(--landing-ink) 8%, transparent);
}
.scene-chip {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 5px;
  margin-top: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.scene-chip[data-tone='ok'] {
  background: var(--landing-success-tint);
  color: var(--landing-success);
}
@keyframes scene-drift {
  to {
    transform: translateY(calc(-50% - 14px));
  }
}
@media (max-width: 760px) {
  .scene {
    mask-image:
      linear-gradient(to bottom, transparent var(--horizon), #000 calc(var(--horizon) + 160px)),
      linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .scene-plane {
    grid-template-columns: repeat(7, 170px);
    gap: 20px;
  }
  .scene-track {
    gap: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .scene-track {
    animation: none;
  }
  .scene-tilt {
    transition: none;
  }
}
</style>
