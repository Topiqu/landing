<template>
  <section
    id="faq"
    class="scroll-mt-20 border-b border-brand-line bg-brand-surface px-6 py-24 dark:border-white/10 dark:bg-[#111418] md:py-32"
  >
    <div class="mx-auto grid max-w-6xl gap-14 md:grid-cols-[0.7fr_1.3fr]">
      <div>
        <p class="eyebrow">FAQ</p>
        <h2 class="section-title">{{ $t('landing.faq.title') }}</h2>
        <p class="section-lede mt-5">{{ $t('landing.faq.subtitle') }}</p>
        <a
          href="mailto:support@topiqu.com"
          class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent underline underline-offset-4 dark:text-indigo-300"
          ><Icon name="mdi:arrow-right" />{{ $t('landing.faq.cta_button') }}</a
        >
      </div>

      <div class="border-t border-brand-line dark:border-slate-700">
        <div v-for="(item, index) in faqItems" :key="index" class="border-b border-brand-line dark:border-slate-700">
          <button
            class="flex w-full items-center justify-between gap-6 border-0 bg-transparent py-6 text-left"
            :aria-expanded="activeItem === index"
            @click="toggleItem(index)"
          >
            <span class="text-lg font-semibold text-brand-ink dark:text-white">{{ $t(item.question) }}</span>
            <Icon :name="activeItem === index ? 'mdi:minus' : 'mdi:plus'" class="shrink-0 text-brand-accent" />
          </button>
          <div
            class="grid transition-[grid-template-rows] duration-200"
            :class="activeItem === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <p class="max-w-2xl pb-6 leading-7 text-brand-muted dark:text-slate-300">{{ $t(item.answer) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const activeItem = shallowRef<number | null>(0)
const toggleItem = (index: number) => {
  activeItem.value = activeItem.value === index ? null : index
}
const faqItems = Array.from({ length: 5 }, (_, index) => ({
  question: `landing.faq.items.${index}.q`,
  answer: `landing.faq.items.${index}.a`,
}))
</script>
