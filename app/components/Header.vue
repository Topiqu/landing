<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { platformUrl } = useRuntimeConfig().public
const theme = useThemeStore()
const hydrated = ref(false)
const open = ref(false)
onMounted(() => {
  hydrated.value = true
})
const links = computed(() => [
  { label: t('landing.design.nav.features'), to: localePath('/') + '#specs' },
  { label: t('landing.pricing.title'), to: localePath('/') + '#pricing' },
  { label: t('landing.design.nav.docs'), to: localePath('/docs') },
])
</script>
<template>
  <UHeader v-model:open="open" title="Topiqu" :to="localePath('/')" class="landing-header">
    <template #left><BrandLogo /></template>
    <nav class="desktop-nav" :aria-label="t('landing.design.nav.navigation')">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
    </nav>
    <template #right>
      <UButton
        :to="switchLocalePath(locale === 'cs' ? 'en' : 'cs')"
        color="neutral"
        variant="ghost"
        :aria-label="locale === 'cs' ? 'Switch to English' : 'Přepnout do češtiny'"
        >{{ locale === 'cs' ? 'EN' : 'CZ' }}</UButton
      >
      <UButton
        color="neutral"
        variant="ghost"
        square
        :aria-label="t('landing.design.nav.theme')"
        :icon="hydrated && theme.isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'"
        @click="theme.toggle"
      />
      <UButton :to="platformUrl + '/' + locale + '/auth'" color="neutral" variant="ghost" class="header-login">{{
        $t('common.auth.login')
      }}</UButton>
      <UButton :to="localePath({ name: 'onboarding-site' })" class="header-start">{{
        $t('landing.design.hero.cta')
      }}</UButton>
    </template>
    <template #body>
      <nav class="mobile-nav" :aria-label="t('landing.design.nav.navigation')">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="open = false">{{ link.label }}</NuxtLink>
        <NuxtLink :to="localePath('/') + '#faq'" @click="open = false">FAQ</NuxtLink>
        <UButton :to="platformUrl + '/' + locale + '/auth'" color="neutral" variant="outline">{{
          $t('common.auth.login')
        }}</UButton>
        <UButton :to="localePath({ name: 'onboarding-site' })">{{ $t('landing.design.hero.cta') }}</UButton>
      </nav>
    </template>
  </UHeader>
</template>
<style scoped>
.landing-header {
  position: sticky;
  top: 0;
  background: var(--landing-surface);
  border-bottom: 1px solid var(--landing-line);
  backdrop-filter: none;
}
.desktop-nav {
  display: flex;
  gap: 2rem;
}
.desktop-nav a,
.mobile-nav > a {
  color: var(--landing-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.desktop-nav a:hover {
  color: var(--landing-accent);
}
.mobile-nav {
  display: grid;
  gap: 1.75rem;
  padding: 1rem 0;
}
.mobile-nav > a {
  font-size: 18px;
}
@media (max-width: 1023px) {
  .desktop-nav,
  .header-login {
    display: none;
  }
}
@media (max-width: 479px) {
  .header-start {
    display: none;
  }
}
</style>
