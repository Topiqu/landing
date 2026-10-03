<script setup lang="ts">
import { NuxtLink } from '#components'

useSeoMeta({ robots: 'noindex, nofollow' })

const store = useOnboardingStore()
const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const totalSteps = TOTAL_STEPS
const stepPath = (step: OnboardingStep) => localePath({ name: stepRouteName(step) })
const currentIndex = computed(() => {
  const name = String(route.name ?? '').split('___')[0] ?? ''
  return Math.max(
    0,
    ONBOARDING_STEPS.findIndex((step) => stepRouteName(step) === name),
  )
})
// Any step is open once the required steps before it are complete, so optional ones can be jumped over;
// those stay flagged as unfilled until the visitor comes back to them.
const stepState = (step: OnboardingStep, index: number) => {
  if (index === currentIndex.value) return 'current'
  if (store.isStepComplete(step)) return 'done'
  if (OPTIONAL_STEPS.includes(step) && (store.progress[step] === 'skipped' || index < currentIndex.value))
    return 'skipped'
  return 'upcoming'
}
const steps = computed(() =>
  ONBOARDING_STEPS.map((step, index) => {
    const state = stepState(step, index)
    const optional = OPTIONAL_STEPS.includes(step)
    return {
      step,
      index,
      label: t('landing.onboarding.steps.' + step),
      state,
      note: state === 'skipped' ? t('landing.onboarding.unfilled') : optional ? t('landing.onboarding.optional') : '',
      reachable: ONBOARDING_STEPS.slice(0, index).every(
        (before) => OPTIONAL_STEPS.includes(before) || store.isStepComplete(before),
      ),
    }
  }),
)

useHead({ title: () => `${steps.value[currentIndex.value]?.label} · ${t('landing.onboarding.title')} · Topiqu` })
onKeyStroke('Escape', () => navigateTo(localePath('/')))
</script>
<template>
  <div class="onb-shell">
    <header class="onb-header">
      <div class="onb-header-inner">
        <BrandLogo />
        <UButton
          :to="localePath('/')"
          color="neutral"
          variant="ghost"
          icon="mdi:close"
          square
          :aria-label="$t('landing.onboarding.close')"
        />
      </div>
    </header>
    <main class="onb-main" aria-labelledby="onboarding-title">
      <div class="onb-frame">
        <nav class="onb-steps" :aria-label="$t('landing.onboarding.stepsLabel')">
          <p class="onb-step-count">
            <span>{{ $t('landing.onboarding.title') }}</span>
            <span>{{ $t('landing.onboarding.stepLabel', { current: currentIndex + 1, total: totalSteps }) }}</span>
          </p>
          <div class="onb-progress" aria-hidden="true">
            <span :style="{ width: ((currentIndex + 1) / totalSteps) * 100 + '%' }" />
          </div>
          <ol>
            <li v-for="item in steps" :key="item.step" :data-state="item.state">
              <component
                :is="item.state !== 'current' && item.reachable ? NuxtLink : 'span'"
                :to="item.state !== 'current' && item.reachable ? stepPath(item.step) : undefined"
                class="onb-step"
                :aria-current="item.state === 'current' ? 'step' : undefined"
              >
                <span class="onb-step-dot">
                  <Icon v-if="item.state === 'done'" name="mdi:check" aria-hidden="true" />
                  <Icon v-else-if="item.state === 'skipped'" name="mdi:minus" aria-hidden="true" />
                  <template v-else>{{ item.index + 1 }}</template>
                </span>
                <span class="onb-step-text">
                  <span class="onb-step-label">{{ item.label }}</span>
                  <small v-if="item.note">{{ item.note }}</small>
                </span>
              </component>
            </li>
          </ol>
        </nav>
        <section class="onb-card">
          <slot />
        </section>
      </div>
    </main>
    <input
      v-model="store.form.website"
      class="onb-honeypot"
      type="text"
      name="website"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />
  </div>
</template>
