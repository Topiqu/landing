<template>
  <footer class="bg-brand-page px-6 py-14 dark:bg-[#080a0d]">
    <div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div class="mb-4 flex items-center gap-3">
          <NuxtImg src="/topik_normal_rm.png" width="44" height="44" alt="" /><span
            class="text-lg font-semibold text-brand-ink dark:text-white"
            >Topiqu</span
          >
        </div>
        <p class="max-w-md text-sm leading-6 text-brand-muted dark:text-slate-400">{{ $t('landing.footer.desc') }}</p>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#4f4e48] dark:text-slate-300">
        <NuxtLinkLocale to="/docs">Docs</NuxtLinkLocale><NuxtLinkLocale to="/changelog">Changelog</NuxtLinkLocale>
        <NuxtLinkLocale to="tos">{{ $t('common.links.terms') }}</NuxtLinkLocale
        ><NuxtLinkLocale to="privacy">{{ $t('common.links.privacy') }}</NuxtLinkLocale>
        <button type="button" class="border-0 bg-transparent p-0 font-semibold text-inherit" @click="reopen">
          {{ $t('common.cookies.settings') }}
        </button>
      </div>
    </div>
    <div class="mx-auto mt-10 max-w-7xl border-t border-brand-line pt-5 text-xs text-brand-muted dark:border-white/10">
      &copy; {{ new Date().getFullYear() }} Topiqu {{ $t('landing.footer.rights') }}
    </div>
  </footer>
</template>
<script setup lang="ts">
const { reopen } = useCookieConsent()
</script>
