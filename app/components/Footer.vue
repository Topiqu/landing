<template>
  <footer class="py-12 px-6 border-t border-slate-200 dark:border-white/10 text-center bg-white dark:bg-[#020408]">
    <div class="flex flex-col items-center justify-center gap-4 mb-8">
      <div class="p-2 bg-slate-50 dark:bg-slate-800 rounded-full">
        <NuxtImg
          src="/topik_normal_rm.png"
          width="48"
          class="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
        />
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
        {{ $t('landing.footer.desc') }}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-700 dark:text-slate-300 mb-8">
      <NuxtLinkLocale to="/docs" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Docs</NuxtLinkLocale>
      <NuxtLinkLocale to="/changelog" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Changelog</NuxtLinkLocale>
      <NuxtLinkLocale to="tos" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{{
        $t('common.links.terms')
      }}</NuxtLinkLocale>
      <NuxtLinkLocale to="privacy" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{{
        $t('common.links.privacy')
      }}</NuxtLinkLocale>
      <button
        type="button"
        class="m-0 appearance-none border-0 bg-transparent p-0 font-bold text-inherit hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        @click="reopen"
      >
        {{ $t('common.cookies.settings') }}
      </button>
    </div>

    <p class="text-xs text-slate-400">&copy; {{ new Date().getFullYear() }} Topiqu {{ $t('landing.footer.rights') }}</p>
  </footer>
</template>

<script setup lang="ts">
const { reopen } = useCookieConsent()
</script>
