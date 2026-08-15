<template>
  <Transition
    enterActiveClass="transition duration-300 ease-out"
    enterFromClass="translate-y-4 opacity-0"
    leaveActiveClass="transition duration-200 ease-in"
    leaveToClass="translate-y-4 opacity-0"
  >
    <div
      v-if="banner"
      role="dialog"
      aria-modal="false"
      :aria-label="$t('common.cookies.title')"
      class="fixed bottom-0 inset-x-0 z-100 p-4 sm:p-6"
    >
      <div
        class="max-w-3xl mx-auto bg-brand-surface dark:bg-[#111418] border border-brand-line dark:border-neutral-800 rounded-xl shadow-lg shadow-gray-900/10 dark:shadow-black/40 p-5 sm:p-6"
      >
        <div class="flex items-start gap-4">
          <span
            class="hidden sm:flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-amber-50 dark:bg-amber-500/10"
          >
            <Icon name="mdi:cookie" class="w-6 h-6 text-amber-500" />
          </span>

          <div class="flex-1 min-w-0">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {{ $t('common.cookies.title') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ $t('common.cookies.body') }}
              <NuxtLinkLocale to="privacy" class="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
                {{ $t('common.cookies.more') }}
              </NuxtLinkLocale>
            </p>

            <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-accent hover:bg-[#4035ad] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors"
                @click="accept"
              >
                {{ $t('common.cookies.accept') }}
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-[#ebe8df] dark:bg-neutral-800 hover:bg-[#ddd9cf] dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition-colors"
                @click="reject"
              >
                {{ $t('common.cookies.reject') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { banner, accept, reject } = useCookieConsent()
</script>
