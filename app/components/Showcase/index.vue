<template>
  <section id="specs" ref="root" class="landing-section showcase-section">
    <div
      class="landing-container showcase-grid"
      :data-animated="animated || undefined"
      @pointerenter="paused = true"
      @pointerleave="paused = false"
    >
      <div class="section-heading showcase-heading">
        <p class="eyebrow">{{ $t('landing.design.showcase.eyebrow') }}</p>
        <h2>{{ $t('landing.design.showcase.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.showcase.text') }}</p>
      </div>

      <div
        role="tablist"
        aria-orientation="vertical"
        :aria-label="$t('landing.design.showcase.tabsLabel')"
        class="showcase-tabs"
        @keydown="onKeydown"
      >
        <div
          v-for="(item, index) in items"
          :key="steps[index]!.key"
          class="showcase-tab"
          :data-active="index === active || undefined"
        >
          <button
            :id="`showcase-tab-${index}`"
            type="button"
            role="tab"
            :aria-selected="index === active"
            aria-controls="showcase-panel"
            :tabindex="index === active ? 0 : -1"
            @click="select(index)"
          >
            <Icon :name="steps[index]!.icon" aria-hidden="true" />
            <span>{{ item.title }}</span>
          </button>
          <div class="showcase-detail">
            <p>{{ item.text }}</p>
          </div>
          <span class="showcase-progress" aria-hidden="true">
            <span v-if="index === active" :key="active" :data-playing="playing || undefined" @animationend="advance" />
          </span>
        </div>
      </div>

      <div id="showcase-panel" role="tabpanel" :aria-labelledby="`showcase-tab-${active}`" class="showcase-stage">
        <div role="img" :aria-label="$t('landing.design.showcase.sceneLabel', { step: items[active]?.title })">
          <ShowcaseWindow :nav="step.nav" :crumb="crumb">
            <Transition name="showcase-scene" mode="out-in">
              <ShowcaseKnowledge v-if="step.key === 'context'" />
              <ShowcaseResearch v-else-if="step.key === 'research'" />
              <ShowcaseVerify v-else-if="step.key === 'verify'" />
              <ShowcaseDecide v-else />
            </Transition>
          </ShowcaseWindow>
          <Transition name="showcase-callout" mode="out-in">
            <p :key="step.key" class="showcase-callout">
              <span><Icon :name="step.icon" /></span>
              {{ $t(`landing.design.showcase.mock.${callouts[step.key]}.callout`) }}
            </p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShowcaseNav } from './Window.vue'

const { t } = useI18n()
const steps = [
  { key: 'context', nav: 'knowledge', icon: 'mdi:book-open-page-variant-outline' },
  { key: 'research', nav: 'write', icon: 'mdi:web' },
  { key: 'verify', nav: 'write', icon: 'mdi:shield-check-outline' },
  { key: 'decide', nav: 'settings', icon: 'mdi:account-check-outline' },
] as const satisfies readonly { key: string; nav: ShowcaseNav; icon: string }[]
const callouts = {
  context: 'knowledge',
  research: 'research',
  verify: 'verify',
  decide: 'decide',
} as const
const items = useMessageList<'title' | 'text'>('landing.design.showcase.items')

const active = shallowRef(0)
const step = computed(() => steps[active.value]!)
const crumb = computed(() => {
  if (step.value.nav === 'write') return t('landing.design.showcase.mock.article')
  if (step.value.nav === 'settings') return t('landing.design.showcase.mock.decide.schedule')
  return t(`landing.design.showcase.mock.nav.${step.value.nav}`)
})

// Steps advance on their own until the visitor picks one.
const autoplay = shallowRef(true)
const paused = shallowRef(false)
const mounted = useMounted()
const reducedMotion = usePreferredReducedMotion()
const root = useTemplateRef<HTMLElement>('root')
const visible = useElementVisibility(root, { threshold: 0.3 })
const animated = computed(() => mounted.value && autoplay.value && reducedMotion.value !== 'reduce')
const playing = computed(() => animated.value && visible.value && !paused.value)

const select = (index: number, focus = false) => {
  autoplay.value = false
  active.value = (index + steps.length) % steps.length
  if (focus) nextTick(() => document.getElementById(`showcase-tab-${active.value}`)?.focus())
}
const advance = () => {
  active.value = (active.value + 1) % steps.length
}
const onKeydown = (event: KeyboardEvent) => {
  const offsets: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
  let index: number | undefined
  if (event.key in offsets) index = active.value + offsets[event.key]!
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = steps.length - 1
  if (index === undefined) return
  event.preventDefault()
  select(index, true)
}
</script>

<style scoped>
.showcase-section {
  position: relative;
  border-top: 0;
  background: linear-gradient(180deg, var(--landing-tint) 0, var(--landing-bg) 420px);
}
.showcase-grid {
  display: grid;
  grid-template-areas:
    'heading stage'
    'tabs stage';
  grid-template-columns: minmax(0, 4.6fr) minmax(0, 7.4fr);
  grid-template-rows: auto 1fr;
  gap: 0 64px;
}
.showcase-heading {
  grid-area: heading;
  margin-bottom: 36px;
}
.showcase-tabs {
  display: flex;
  flex-direction: column;
  grid-area: tabs;
}
.showcase-tab {
  position: relative;
  padding-left: 22px;
}
.showcase-tab button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 10px 0;
  border: 0;
  background: none;
  color: var(--landing-muted);
  font: inherit;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.02em;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
}
.showcase-tab button:hover,
.showcase-tab[data-active] button {
  color: var(--landing-ink);
}
.showcase-tab button .iconify {
  flex: none;
  font-size: 20px;
  transition: color 0.2s;
}
.showcase-tab[data-active] button .iconify {
  color: var(--landing-accent);
}
.showcase-tab button:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 2px;
  border-radius: 6px;
}
.showcase-detail {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}
.showcase-tab[data-active] .showcase-detail {
  grid-template-rows: 1fr;
}
.showcase-detail p {
  overflow: hidden;
  max-width: 440px;
  padding-left: 32px;
  color: var(--landing-muted);
  font-size: 15px;
  line-height: 1.7;
}
.showcase-tab[data-active] .showcase-detail p {
  padding-bottom: 16px;
}
.showcase-progress {
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  overflow: hidden;
  background: var(--landing-line);
}
.showcase-progress > span {
  position: absolute;
  inset: 0;
  background: var(--landing-accent);
  transform-origin: top;
}
.showcase-grid[data-animated] .showcase-progress > span {
  animation: showcase-progress 7s linear forwards paused;
}
.showcase-grid[data-animated] .showcase-progress > span[data-playing] {
  animation-play-state: running;
}
/* Pinned to the top so the window does not shift when the active step's description changes height. */
.showcase-stage {
  position: relative;
  grid-area: stage;
  align-self: start;
  margin-top: 6px;
}
.showcase-callout {
  position: absolute;
  bottom: -22px;
  left: -36px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(340px, 80%);
  padding: 10px 16px 10px 10px;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
  box-shadow: 0 18px 40px -20px #0f172a59;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.4;
}
.showcase-callout > span {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--landing-accent);
  color: var(--landing-surface);
  font-size: 17px;
}

.showcase-scene-enter-active,
.showcase-scene-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.showcase-scene-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.showcase-scene-leave-to {
  opacity: 0;
}
.showcase-callout-enter-active {
  transition:
    opacity 0.4s 0.35s ease,
    transform 0.4s 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.showcase-callout-leave-active {
  transition: opacity 0.15s ease;
}
.showcase-callout-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.showcase-callout-leave-to {
  opacity: 0;
}
@keyframes showcase-progress {
  from {
    transform: scaleY(0);
  }
}
@media (max-width: 1100px) {
  .showcase-grid {
    column-gap: 40px;
  }
  .showcase-callout {
    left: -20px;
  }
}
@media (max-width: 900px) {
  .showcase-grid {
    grid-template-areas:
      'heading'
      'stage'
      'tabs';
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
  }
  .showcase-stage {
    margin-bottom: 52px;
  }
  .showcase-callout {
    left: 16px;
  }
}
@media (max-width: 600px) {
  .showcase-heading {
    margin-bottom: 28px;
  }
  .showcase-stage {
    margin-inline: -8px;
  }
  .showcase-callout {
    right: 16px;
    max-width: none;
  }
  .showcase-tab button {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .showcase-detail,
  .showcase-scene-enter-active,
  .showcase-scene-leave-active,
  .showcase-callout-enter-active {
    transition: none;
  }
}
</style>
