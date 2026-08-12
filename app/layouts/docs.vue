<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#020408] dark:text-slate-100">
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#020408]/90">
      <div class="mx-auto flex h-16 max-w-[100rem] items-center justify-between px-5 lg:px-8">
        <div class="flex items-center gap-6">
          <NuxtLinkLocale to="/" class="flex items-center gap-2 no-underline">
            <NuxtImg src="/logo.png" width="32" height="32" alt="Topiqu" />
            <span class="font-bold">Topiqu Developers</span>
          </NuxtLinkLocale>
          <nav class="hidden items-center gap-1 sm:flex">
            <NuxtLinkLocale to="/docs" class="docs-nav-link">Docs</NuxtLinkLocale>
            <a href="/api-reference" class="docs-nav-link">API Reference</a>
            <NuxtLinkLocale to="/changelog" class="docs-nav-link">Changelog</NuxtLinkLocale>
          </nav>
        </div>
        <a
          :href="`${platformUrl}/${locale}/auth`"
          class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-indigo-500"
        >
          {{ locale === 'cs' ? 'Otevřít aplikaci' : 'Open app' }}
        </a>
      </div>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { platformUrl } = useRuntimeConfig().public
</script>

<style scoped>
.docs-nav-link {
  border-radius: 0.5rem;
  color: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
}
.docs-nav-link:hover { background: rgb(241 245 249); }
:global(.dark) .docs-nav-link:hover { background: rgb(255 255 255 / 0.06); }
</style>
