<template>
  <div class="min-h-screen bg-[#EBE9E4] dark:bg-[#0C0C0C] flex flex-col">
    <StatusBar />

    <header class="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
      <NuxtLinkLocale to="/" class="flex items-center gap-2 group">
        <NuxtImg src="/logo.png" width="32" class="grayscale group-hover:grayscale-0 transition-all duration-300" />
        <span class="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Topiqu</span>
      </NuxtLinkLocale>

      <div class="flex items-center gap-4">
        <span class="text-xs font-black uppercase tracking-widest text-[#888] dark:text-[#71717A]">
          {{ $t('landing.onboarding.stepLabel', { current: currentStep, total: TOTAL_STEPS }) }}
        </span>
        <Button
          square
          borderless
          size="sm"
          variant="transparent"
          icon="mdi:close"
          :aria="$t('common.actions.close')"
          :title="$t('common.actions.close')"
          class="text-[#888] hover:text-[#111] dark:hover:text-white"
          @click="navigateTo(localePath('/'))"
        />
      </div>
    </header>

    <div
      class="flex gap-1.5 px-6 mb-8 max-w-2xl mx-auto w-full"
      role="progressbar"
      :aria-valuenow="currentStep"
      :aria-valuemin="1"
      :aria-valuemax="TOTAL_STEPS"
    >
      <div
        v-for="s in TOTAL_STEPS"
        :key="s"
        class="h-1.5 flex-1 rounded-full transition-colors duration-500"
        :class="currentStep >= s ? 'bg-[#111] dark:bg-white' : 'bg-[#D4D4D8] dark:bg-[#27272A]'"
      ></div>
    </div>

    <main class="flex-1 flex flex-col items-center px-4 pb-12">
      <div
        class="bg-[#FAFAFA] dark:bg-[#18181B] rounded-[2.5rem] w-full max-w-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div class="p-8 md:p-12">
          <div class="flex items-center gap-4 mb-8">
            <div
              class="w-12 h-12 bg-[#D8B4FE] text-[#111] rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0_0_rgba(17,17,17,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transform -rotate-3"
            >
              <Icon name="mdi:rocket-launch" class="w-6 h-6" />
            </div>
            <h1
              id="onboarding-title"
              class="text-3xl md:text-4xl font-black text-[#111] dark:text-white tracking-tighter leading-tight"
            >
              {{ $t('landing.onboarding.title') }}
            </h1>
          </div>

          <FormField
            v-model="form.website"
            label="Website"
            type="text"
            name="website"
            aria-hidden="true"
            tabindex="-1"
            autocomplete="off"
            class="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
          />
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { TOTAL_STEPS } from '~/composables/useOnboarding'

useSeoMeta({ robots: 'noindex, nofollow' })

const store = useOnboardingStore()
const { form } = store
const localePath = useLocalePath()
const route = useRoute()

const ROUTE_NAME_TO_STEP: Record<string, number> = {
  'onboarding-site': 1,
  'onboarding-design': 2,
  'onboarding-account': 3,
  'onboarding-plan': 4,
  'onboarding-verify': 5,
  'onboarding-summary': 6,
}

const currentStep = computed(() => {
  const name = String(route.name ?? '').split('___')[0] ?? ''
  return ROUTE_NAME_TO_STEP[name] ?? 1
})

onKeyStroke('Escape', () => navigateTo(localePath('/')))
</script>
