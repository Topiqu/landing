<script setup lang="ts">
const { y } = useWindowScroll()
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale, t } = useI18n()
const mobileMenuOpen = shallowRef(false)
const desktopLanguageOpen = shallowRef(false)
const mobileLanguageOpen = shallowRef(false)
const desktopLanguagePicker = ref<HTMLElement | null>(null)
const { platformUrl, statusUrl } = useRuntimeConfig().public
const localeOptions = [
  { code: 'cs' as const, short: 'CS', label: 'Čeština', flag: '🇨🇿' },
  { code: 'en' as const, short: 'EN', label: 'English', flag: '🇬🇧' },
]
const activeLocale = computed(() => localeOptions.find(option => option.code === locale.value) ?? localeOptions[0])
onClickOutside(desktopLanguagePicker, () => {
  desktopLanguageOpen.value = false
})
onKeyStroke('Escape', () => {
  desktopLanguageOpen.value = false
  mobileLanguageOpen.value = false
})

const { data: system } = await useFetch('/api/status', { default: () => ({ status: 'operational' as const }) })
const status = computed(() => system.value.status)
const statusDot = computed(
  () =>
    ({ operational: 'bg-emerald-600', degraded: 'bg-amber-500', maintenance: 'bg-blue-500', down: 'bg-red-600' })[
      status.value
    ],
)
const mobileLinks = computed(() => [
  { id: 'specs', label: t('common.actions.learn_more') },
  { id: 'workflow', label: t('landing.workflow_nav') },
  { id: 'pricing', label: t('landing.pricing.title') },
  { id: 'faq', label: 'FAQ' },
])

const goToLogin = () => navigateTo(`${platformUrl}/${locale.value}/auth`, { external: true })
const scrollTo = (id: string) => {
  const home = localePath('/')
  if (route.path !== home) return navigateTo({ path: home, hash: `#${id}` })
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const handleMobileLink = (id: string) => {
  mobileMenuOpen.value = false
  nextTick(() => scrollTo(id))
}
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
    desktopLanguageOpen.value = false
    mobileLanguageOpen.value = false
  },
)
</script>

<template>
  <header
    class="fixed top-0 z-50 w-full border-b transition-colors"
    :class="
      y > 40
        ? 'border-brand-line bg-[#f4f1e9]/95 dark:border-white/10 dark:bg-[#080a0d]/95'
        : 'border-transparent bg-transparent'
    "
  >
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <NuxtLinkLocale to="/" class="flex items-center gap-2.5 no-underline">
        <NuxtImg src="/logo.png" width="36" height="36" loading="eager" alt="Topiqu" />
        <span class="text-lg font-semibold tracking-tight text-brand-ink dark:text-white">Topiqu</span>
      </NuxtLinkLocale>

      <div class="hidden items-center gap-1 md:flex">
        <button class="nav-link" @click="scrollTo('specs')">{{ $t('common.actions.learn_more') }}</button>
        <button class="nav-link" @click="scrollTo('workflow')">{{ $t('landing.workflow_nav') }}</button>
        <button class="nav-link" @click="scrollTo('pricing')">{{ $t('landing.pricing.title') }}</button>
        <NuxtLinkLocale to="/docs" class="nav-link no-underline">Docs</NuxtLinkLocale>
        <a
          :href="statusUrl"
          target="_blank"
          rel="noopener"
          class="ml-3 flex items-center gap-2 px-3 py-2 text-xs text-brand-muted no-underline dark:text-slate-400"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="statusDot" />{{ $t(`common.status.${status}`) }}
        </a>
        <div ref="desktopLanguagePicker" class="relative ml-1">
          <button
            type="button"
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-brand-line bg-white/55 px-2.5 py-2 text-xs font-bold text-brand-ink dark:border-white/15 dark:bg-white/5 dark:text-white"
            :aria-label="locale === 'cs' ? 'Změnit jazyk' : 'Change language'"
            aria-haspopup="menu"
            :aria-expanded="desktopLanguageOpen"
            @click="desktopLanguageOpen = !desktopLanguageOpen"
          >
            <span aria-hidden="true">{{ activeLocale.flag }}</span>
            <span>{{ activeLocale.short }}</span>
            <Icon
              name="mdi:chevron-down"
              size="15"
              class="text-brand-muted transition-transform"
              :class="desktopLanguageOpen ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-if="desktopLanguageOpen"
            role="menu"
            class="absolute right-0 top-[calc(100%+0.5rem)] min-w-40 overflow-hidden rounded-xl border border-brand-line bg-[#faf8f2] p-1.5 shadow-xl dark:border-white/15 dark:bg-[#111318]"
          >
            <NuxtLink
              v-for="option in localeOptions"
              :key="option.code"
              :to="switchLocalePath(option.code)"
              role="menuitem"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-ink no-underline hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              :aria-current="locale === option.code ? 'page' : undefined"
            >
              <span class="text-base" aria-hidden="true">{{ option.flag }}</span>
              <span class="flex-1">{{ option.label }}</span>
              <Icon v-if="locale === option.code" name="mdi:check" size="16" class="text-brand-accent" />
            </NuxtLink>
          </div>
        </div>
        <button class="nav-link ml-1" @click="goToLogin">{{ $t('common.auth.login') }}</button>
        <Button
          variant="primary"
          class="ml-2 !rounded-lg !border-brand-accent !bg-brand-accent px-5 shadow-none hover:!bg-[#4035ad]"
          @click="navigateTo(localePath('/onboarding'))"
        >
          {{ $t('common.actions.get_started') }}
        </Button>
      </div>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line bg-transparent text-brand-ink dark:border-slate-700 dark:text-white md:hidden"
        :aria-label="$t('common.actions.openMenu')"
        @click="mobileMenuOpen = true"
      >
        <Icon name="mdi:menu" size="22" />
      </button>
    </nav>
  </header>

  <Transition name="mobile-menu">
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-[100] flex flex-col bg-brand-page px-6 dark:bg-[#080a0d] md:hidden"
    >
      <div class="flex items-center justify-between border-b border-brand-line py-5 dark:border-white/10">
        <span class="text-lg font-semibold">Topiqu</span>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line bg-transparent dark:border-slate-700"
          :aria-label="$t('common.actions.close')"
          @click="mobileMenuOpen = false"
        >
          <Icon name="mdi:close" />
        </button>
      </div>
      <nav class="flex flex-col py-8">
        <button
          v-for="item in mobileLinks"
          :key="item.id"
          class="flex items-center justify-between border-b border-brand-line bg-transparent py-5 text-left text-xl font-semibold dark:border-white/10"
          @click="handleMobileLink(item.id)"
        >
          {{ item.label }}<Icon name="mdi:arrow-right" class="text-brand-accent" />
        </button>
        <NuxtLinkLocale
          to="/docs"
          class="flex items-center justify-between border-b border-brand-line py-5 text-xl font-semibold text-brand-ink no-underline dark:border-white/10 dark:text-white"
          >Docs<Icon name="mdi:arrow-right" class="text-brand-accent"
        /></NuxtLinkLocale>
        <div class="border-b border-brand-line py-5 dark:border-white/10">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-brand-line bg-transparent px-4 py-3 font-semibold dark:border-white/15"
            aria-haspopup="menu"
            :aria-expanded="mobileLanguageOpen"
            @click="mobileLanguageOpen = !mobileLanguageOpen"
          >
            <span class="flex items-center gap-3">
              <span aria-hidden="true">{{ activeLocale.flag }}</span>
              {{ activeLocale.label }}
            </span>
            <Icon
              name="mdi:chevron-down"
              class="text-brand-muted transition-transform"
              :class="mobileLanguageOpen ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-if="mobileLanguageOpen"
            role="menu"
            class="mt-2 overflow-hidden rounded-lg border border-brand-line p-1 dark:border-white/15"
          >
            <NuxtLink
              v-for="option in localeOptions"
              :key="option.code"
              :to="switchLocalePath(option.code)"
              role="menuitem"
              class="flex items-center gap-3 rounded-md px-3 py-3 font-semibold text-brand-ink no-underline hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              :aria-current="locale === option.code ? 'page' : undefined"
              @click="mobileMenuOpen = false"
            >
              <span aria-hidden="true">{{ option.flag }}</span>
              <span class="flex-1">{{ option.label }}</span>
              <Icon v-if="locale === option.code" name="mdi:check" class="text-brand-accent" />
            </NuxtLink>
          </div>
        </div>
      </nav>
      <div class="mt-auto pb-10">
        <Button
          variant="primary"
          size="lg"
          class="w-full !rounded-lg !border-brand-accent !bg-brand-accent shadow-none"
          @click="navigateTo(localePath('/onboarding'))"
          >{{ $t('common.actions.get_started') }}</Button
        >
        <button
          class="mt-3 w-full border-0 bg-transparent py-3 font-semibold text-brand-muted dark:text-slate-300"
          @click="goToLogin"
        >
          {{ $t('common.auth.login') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nav-link {
  border: 0;
  background: transparent;
  padding: 0.65rem 0.75rem;
  color: #5f5e57;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
.nav-link:hover {
  color: #171714;
}
:global(html.dark) .nav-link {
  color: #cbd5e1;
}
:global(html.dark) .nav-link:hover {
  color: #fff;
}
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}
</style>
