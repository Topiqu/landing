<script setup lang="ts">
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
const steps = computed(() =>
  ONBOARDING_STEPS.map((step, index) => ({
    step,
    index,
    label: t('landing.onboarding.steps.' + step),
    state: index < currentIndex.value ? 'done' : index === currentIndex.value ? 'current' : 'upcoming',
  })),
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
              <NuxtLink v-if="item.state === 'done'" :to="stepPath(item.step)" class="onb-step">
                <span class="onb-step-dot"><Icon name="mdi:check" aria-hidden="true" /></span>
                <span class="onb-step-label">{{ item.label }}</span>
              </NuxtLink>
              <span v-else class="onb-step" :aria-current="item.state === 'current' ? 'step' : undefined">
                <span class="onb-step-dot">{{ item.index + 1 }}</span>
                <span class="onb-step-label">{{ item.label }}</span>
              </span>
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
