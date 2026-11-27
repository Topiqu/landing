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
const authUrl = usePlatformAuthUrl()
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
  { label: t('agencies.nav'), to: localePath('agencies') },
  { label: t('landing.design.nav.docs'), to: localePath('/docs') },
  { label: t('landing.design.nav.changelog'), to: localePath('/changelog') },
])
// The changelog stays in the menu and the footer; the desktop bar has no room for a sixth item.
const desktopLinks = computed(() => links.value.filter((link) => link.to !== localePath('/changelog')))
// Nuxt UI shows the desktop bar from `lg`, where the links collide with the actions, and splits the bar into
// equal halves, which squeezes the links further. Use the menu until `xl` and let the links take the free space.
const headerUi = {
  left: 'tw:xl:flex-none',
  right: 'tw:xl:flex-none',
  center: 'tw:lg:hidden tw:xl:flex',
  toggle: 'tw:lg:inline-flex tw:xl:hidden',
  content: 'tw:lg:flex tw:xl:hidden',
  overlay: 'tw:lg:block tw:xl:hidden',
}
</script>
<template>
  <UHeader v-model:open="open" title="Topiqu" :to="localePath('/')" class="landing-header" :ui="headerUi">
    <template #left><BrandLogo /></template>
    <nav class="desktop-nav" :aria-label="t('landing.design.nav.navigation')">
      <NuxtLink v-for="link in desktopLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
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
      <UButton :to="authUrl" color="neutral" variant="ghost" class="header-login">{{
        $t('common.auth.login')
      }}</UButton>
      <UButton :to="localePath({ name: 'onboarding-site', query: { plan: 'free' } })" class="header-start">{{
        $t('landing.design.hero.cta')
      }}</UButton>
    </template>
    <template #body>
      <nav class="mobile-nav" :aria-label="t('landing.design.nav.navigation')">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="mobile-nav-link" @click="open = false">{{
          link.label
        }}</NuxtLink>
        <NuxtLink :to="localePath('/') + '#faq'" class="mobile-nav-link" @click="open = false">FAQ</NuxtLink>
        <UButton :to="authUrl" color="neutral" variant="outline" block>{{ $t('common.auth.login') }}</UButton>
        <UButton :to="localePath({ name: 'onboarding-site', query: { plan: 'free' } })" block @click="open = false">{{
          $t('landing.design.hero.cta')
        }}</UButton>
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
.mobile-nav-link {
  color: var(--landing-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.desktop-nav a:hover,
.mobile-nav-link:hover {
  color: var(--landing-accent);
}
.mobile-nav {
  display: grid;
  gap: 1.75rem;
  padding: 1rem 0;
}
.mobile-nav-link {
  font-size: 18px;
}
@media (max-width: 1279px) {
  .desktop-nav {
    display: none;
  }
}
@media (max-width: 1023px) {
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
