<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()
const languageItems = computed(() =>
  locales.value.map((language) => ({
    label: language.code === 'cs' ? 'Čeština' : 'English',
    flag: language.code === 'cs' ? '🇨🇿' : '🇬🇧',
    type: 'checkbox' as const,
    checked: language.code === locale.value,
    onSelect: () => setLocale(language.code),
  })),
)
const languageButton = useTemplateRef<{ $el: HTMLButtonElement }>('languageButton')
let languageMenuInteractedOutside = false
const markLanguageInteractionOutside = () => {
  languageMenuInteractedOutside = true
}
const restoreLanguageFocus = (event: Event) => {
  event.preventDefault()
  if (!languageMenuInteractedOutside) languageButton.value?.$el.focus({ preventScroll: true })
  languageMenuInteractedOutside = false
}
const { platformUrl } = useRuntimeConfig().public
const theme = useThemeStore()
const hydrated = ref(false)
const open = ref(false)
onMounted(() => {
  hydrated.value = true
})
const links = computed(() => [
  { label: t('landing.design.nav.features'), to: localePath('/') + '#specs' },
  { label: t('landing.design.nav.capabilities'), to: localePath('/') + '#features' },
  { label: t('landing.pricing.title'), to: localePath('/') + '#pricing' },
  { label: t('landing.design.nav.docs'), to: localePath('/docs') },
  { label: t('landing.design.nav.changelog'), to: localePath('/changelog') },
])
</script>
<template>
  <UHeader v-model:open="open" title="Topiqu" :to="localePath('/')" class="landing-header">
    <template #left><BrandLogo /></template>
    <nav class="desktop-nav" :aria-label="t('landing.design.nav.navigation')">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
    </nav>
    <template #right>
      <UDropdownMenu
        :items="languageItems"
        :content="{
          align: 'end',
          onCloseAutoFocus: restoreLanguageFocus,
          onInteractOutside: markLanguageInteractionOutside,
        }"
        :ui="{ content: 'tw:min-w-44' }"
      >
        <template #item-leading="{ item }">
          <span class="tw:shrink-0 tw:text-lg tw:leading-5" aria-hidden="true">{{ item.flag }}</span>
        </template>
        <UButton
          ref="languageButton"
          color="neutral"
          variant="ghost"
          icon="i-lucide-languages"
          square
          :aria-label="locale === 'cs' ? 'Vybrat jazyk' : 'Choose language'"
        />
      </UDropdownMenu>
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
