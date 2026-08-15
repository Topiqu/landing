<template>
  <section
    class="relative overflow-hidden border-b border-[#d8d4c9] px-6 pb-20 pt-32 dark:border-white/10 md:pb-28 md:pt-44"
  >
    <div class="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div class="relative z-10">
        <p class="mb-6 flex items-center gap-3 text-sm font-semibold text-[#5145cd] dark:text-indigo-300">
          <span class="h-px w-8 bg-current" />
          {{ $t('landing.hero.badge') }}
        </p>

        <h1
          class="mb-7 max-w-[12ch] text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#171714] dark:text-white sm:text-6xl lg:text-7xl"
        >
          {{ $t('landing.hero.title_prefix') }}
          <em class="font-serif font-normal text-[#5145cd] dark:text-indigo-300">{{
            $t('landing.hero.title_suffix')
          }}</em>
        </h1>

        <p class="mb-9 max-w-xl text-lg leading-8 text-[#5f5e57] dark:text-slate-300">
          {{ $t('landing.hero.subtitle') }}
        </p>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button
            variant="primary"
            size="lg"
            icon="mdi:arrow-right"
            icon-position="right"
            class="!rounded-lg !border-[#5145cd] !bg-[#5145cd] px-6 shadow-none hover:!bg-[#4035ad]"
            @click="navigateTo(localePath('/onboarding'))"
          >
            {{ $t('common.actions.get_started') }}
          </Button>
          <button
            class="border-0 bg-transparent px-1 py-3 text-sm font-semibold text-[#36352f] underline decoration-[#aaa69b] underline-offset-4 hover:decoration-[#5145cd] dark:text-slate-200"
            @click="$emit('scroll', 'specs')"
          >
            {{ $t('common.actions.learn_more') }}
          </button>
        </div>

        <p class="mt-8 flex items-center gap-2 text-sm text-[#68675f] dark:text-slate-400">
          <Icon name="mdi:check" class="text-emerald-600" />
          {{ $t('landing.hero.proof') }}
        </p>
      </div>

      <div class="relative mx-auto mt-14 w-full max-w-[650px] sm:mt-24 lg:mt-0">
        <div
          class="absolute right-3 -top-9 z-20 flex h-18 w-18 rotate-2 items-center justify-center overflow-hidden rounded-full border border-[#d8d4c9] bg-[#fbfaf6] p-1 shadow-sm sm:-top-36 sm:h-auto sm:w-40 sm:rotate-3 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:-right-16 lg:-top-30 lg:w-48"
        >
          <NuxtImg
            src="/topik_normal_rm.png"
            width="220"
            height="220"
            :preload="true"
            :alt="$t('landing.hero.mascotAlt')"
            class="h-full w-full object-contain sm:h-auto sm:drop-shadow-[0_14px_18px_rgba(23,23,20,.12)]"
          />
        </div>

        <div
          class="relative z-10 overflow-hidden rounded-[18px] border border-[#cbc7bb] bg-[#fbfaf6] shadow-[0_24px_70px_-45px_rgba(23,23,20,.5)] dark:border-slate-700 dark:bg-[#111418]"
        >
          <div class="flex items-center justify-between border-b border-[#dedacf] px-5 py-3 dark:border-slate-700">
            <div class="flex gap-1.5" aria-hidden="true">
              <span class="h-2.5 w-2.5 rounded-full bg-[#d8d4c9] dark:bg-slate-600" />
              <span class="h-2.5 w-2.5 rounded-full bg-[#d8d4c9] dark:bg-slate-600" />
              <span class="h-2.5 w-2.5 rounded-full bg-[#d8d4c9] dark:bg-slate-600" />
            </div>
            <span class="text-xs font-medium text-[#77756c] dark:text-slate-400">topiqu.com / editor</span>
          </div>

          <div class="grid min-h-[390px] md:grid-cols-[150px_1fr]">
            <aside
              class="hidden border-r border-[#e2ded3] p-4 text-xs text-[#77756c] dark:border-slate-700 dark:text-slate-400 md:block"
            >
              <p class="mb-5 font-semibold text-[#272620] dark:text-white">{{ $t('landing.hero.card.draft') }}</p>
              <div class="space-y-3">
                <p class="flex items-center gap-2">
                  <Icon name="mdi:file-document-outline" /> {{ $t('landing.hero.card.outline') }}
                </p>
                <p class="flex items-center gap-2">
                  <Icon name="mdi:link-variant" /> {{ $t('landing.hero.card.sources') }} <span class="ml-auto">6</span>
                </p>
                <p class="flex items-center gap-2">
                  <Icon name="mdi:account-check-outline" /> {{ $t('landing.hero.card.review') }}
                </p>
              </div>
            </aside>

            <div class="p-6 sm:p-8">
              <div class="mb-7 flex items-center justify-between">
                <span
                  class="rounded-md bg-[#ebe8df] px-2 py-1 text-[11px] font-semibold text-[#5f5e57] dark:bg-slate-800 dark:text-slate-300"
                  >{{ $t('landing.hero.card.draft') }}</span
                >
                <span class="text-xs text-[#8a887f] dark:text-slate-500">{{ $t('landing.hero.card.read') }}</span>
              </div>
              <h2 class="mb-5 max-w-md font-serif text-3xl leading-tight text-[#171714] dark:text-white sm:text-4xl">
                {{ $t('landing.hero.card.headline') }}
              </h2>
              <p class="mb-6 max-w-md text-sm leading-7 text-[#68675f] dark:text-slate-300">
                {{ $t('landing.hero.card.excerpt') }}
              </p>
              <div class="border-l-2 border-[#5145cd] bg-[#f1eee6] px-4 py-3 dark:bg-slate-800/70">
                <div
                  class="mb-1 flex items-center justify-between text-[11px] font-semibold text-[#5145cd] dark:text-indigo-300"
                >
                  <span>{{ $t('landing.hero.card.source_note') }}</span
                  ><span>6/6</span>
                </div>
                <p class="text-xs leading-5 text-[#68675f] dark:text-slate-400">
                  {{ $t('landing.hero.card.source_desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p class="mt-3 text-right font-serif text-sm italic text-[#77756c] dark:text-slate-400">
          {{ $t('landing.hero.card.caption') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

defineEmits<{
  (e: 'scroll', id: string): void
}>()
</script>
