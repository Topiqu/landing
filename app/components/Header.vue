<script setup lang="ts">
const { y } = useWindowScroll()
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const mobileMenuOpen = shallowRef(false)

const { platformUrl, statusUrl } = useRuntimeConfig().public

// Reflect Better Stack's live aggregate state in the header pill. Defaults to
// operational so the pill renders instantly during SSR / before the fetch lands.
const { data: system } = await useFetch('/api/status', {
  default: () => ({ status: 'operational' as const }),
})
const status = computed(() => system.value.status)
const statusStyle = computed(() => STATUS_STYLES[status.value])

const STATUS_STYLES = {
  operational: {
    dot: 'bg-green-500',
    ping: 'bg-green-400',
    border: 'hover:border-green-400 dark:hover:border-green-600',
    text: 'text-slate-600 dark:text-slate-300 group-hover:text-green-700 dark:group-hover:text-green-400',
    mobileBg: 'bg-green-50 dark:bg-green-500/10',
    mobileText: 'text-green-700 dark:text-green-400',
  },
  degraded: {
    dot: 'bg-amber-500',
    ping: 'bg-amber-400',
    border: 'hover:border-amber-400 dark:hover:border-amber-600',
    text: 'text-slate-600 dark:text-slate-300 group-hover:text-amber-700 dark:group-hover:text-amber-400',
    mobileBg: 'bg-amber-50 dark:bg-amber-500/10',
    mobileText: 'text-amber-700 dark:text-amber-400',
  },
  maintenance: {
    dot: 'bg-blue-500',
    ping: 'bg-blue-400',
    border: 'hover:border-blue-400 dark:hover:border-blue-600',
    text: 'text-slate-600 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400',
    mobileBg: 'bg-blue-50 dark:bg-blue-500/10',
    mobileText: 'text-blue-700 dark:text-blue-400',
  },
  down: {
    dot: 'bg-red-500',
    ping: 'bg-red-400',
    border: 'hover:border-red-400 dark:hover:border-red-600',
    text: 'text-slate-600 dark:text-slate-300 group-hover:text-red-700 dark:group-hover:text-red-400',
    mobileBg: 'bg-red-50 dark:bg-red-500/10',
    mobileText: 'text-red-700 dark:text-red-400',
  },
} as const

// Existing clients log in on the platform's auth page. It lives under the
// locale prefix (e.g. /en/auth), so mirror the landing locale in the hand-off.
const goToLogin = () => {
  const url = `${platformUrl}/${locale.value}/auth`
  navigateTo(url, { external: true })
}

const handleMobileLogin = () => {
  mobileMenuOpen.value = false
  goToLogin()
}

const scrollTo = (id: string) => {
  const home = localePath('/')
  if (route.path !== home) {
    navigateTo({ path: home, hash: `#${id}` })
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleMobileLink = (id: string) => {
  mobileMenuOpen.value = false
  nextTick(() => scrollTo(id))
}

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>

<template>
  <header
    class="fixed w-full top-0 z-50 transition-colors dark:border-b dark:border-white/5"
    :class="y > 100 ? 'bg-white/80 dark:bg-[#020408]/80 backdrop-blur shadow-sm' : ''"
  >
    <nav class="flex items-center justify-between px-6 py-6 max-w-[90rem] mx-auto">
      <NuxtLinkLocale to="/" class="group flex items-center gap-2 underline-none decoration-none">
        <NuxtImg
          src="/logo.png"
          width="40"
          height="40"
          loading="eager"
          fetchpriority="high"
          decoding="sync"
          alt="Topiqu"
          class="grayscale group-hover:grayscale-0 transition-all duration-300"
        />
        <span class="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Topiqu</span>
      </NuxtLinkLocale>

      <div class="hidden md:flex gap-3 items-center">
        <a
          :href="statusUrl"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors group"
          :class="statusStyle.border"
        >
          <span class="relative flex h-2 w-2 shrink-0">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              :class="statusStyle.ping"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2" :class="statusStyle.dot"></span>
          </span>
          <span class="text-xs font-bold transition-colors whitespace-nowrap" :class="statusStyle.text">
            {{ $t(`common.status.${status}`) }}
          </span>
        </a>

        <Button variant="transparent" borderless @click="scrollTo('specs')">
          {{ $t('common.actions.learn_more') }}
        </Button>

        <Button variant="transparent" borderless @click="scrollTo('pricing')">
          {{ $t('landing.pricing.title') }}
        </Button>

        <Button variant="transparent" borderless @click="scrollTo('faq')"> FAQ </Button>

        <Button variant="transparent" icon="mdi:login" class="rounded-full" @click="goToLogin">
          {{ $t('common.auth.login') }}
        </Button>

        <Button
          variant="primary"
          class="shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 rounded-full px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
          @click="navigateTo(localePath('/onboarding'))"
        >
          {{ $t('common.actions.get_started') }}
        </Button>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden flex items-center justify-center p-2 rounded-xl border-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors"
        :aria-label="$t('common.actions.openMenu')"
        type="button"
        @click="mobileMenuOpen = true"
      >
        <Icon name="mdi:menu" size="22" />
      </button>
    </nav>
  </header>

  <!-- Mobile menu overlay -->
  <Transition name="mobile-menu">
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-[100] flex flex-col md:hidden bg-[#F8FAFC] dark:bg-[#060c14] overflow-hidden"
    >
      <!-- Background decoration -->
      <div
        class="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/8 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
      ></div>

      <!-- Header bar -->
      <div
        class="relative z-10 flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/5"
      >
        <NuxtLinkLocale to="/" class="group flex items-center gap-2" @click="mobileMenuOpen = false">
          <NuxtImg
            src="/logo.png"
            width="34"
            height="34"
            loading="eager"
            decoding="async"
            alt="Topiqu"
            class="grayscale group-hover:grayscale-0 transition-all duration-300"
          />
          <span class="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Topiqu</span>
        </NuxtLinkLocale>
        <button
          class="flex items-center justify-center p-2 rounded-xl border-0 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors"
          :aria-label="$t('common.actions.close')"
          @click="mobileMenuOpen = false"
        >
          <Icon name="mdi:close" size="20" />
        </button>
      </div>

      <!-- Status pill -->
      <div class="relative z-10 px-5 pt-7 pb-3">
        <a
          :href="statusUrl"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl w-fit"
          :class="statusStyle.mobileBg"
          @click="mobileMenuOpen = false"
        >
          <span class="relative flex h-2 w-2 shrink-0">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              :class="statusStyle.ping"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2" :class="statusStyle.dot"></span>
          </span>
          <span class="text-xs font-bold tracking-wide" :class="statusStyle.mobileText">{{
            $t(`common.status.${status}`)
          }}</span>
        </a>
      </div>

      <!-- Nav items -->
      <nav class="relative z-10 flex flex-col px-4 gap-1.5">
        <button
          class="group flex items-center gap-4 px-4 py-3.5 rounded-2xl border-0 text-left hover:bg-white dark:hover:bg-white/5 transition-colors"
          @click="handleMobileLink('specs')"
        >
          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0"
          >
            <Icon name="mdi:robot-happy-outline" size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ $t('common.actions.learn_more') }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Platform features & specs</div>
          </div>
          <Icon
            name="mdi:chevron-right"
            size="18"
            class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors shrink-0"
          />
        </button>

        <button
          class="group flex items-center gap-4 px-4 py-3.5 rounded-2xl border-0 text-left hover:bg-white dark:hover:bg-white/5 transition-colors"
          @click="handleMobileLink('pricing')"
        >
          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0"
          >
            <Icon name="mdi:tag-outline" size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ $t('landing.pricing.title') }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Find the right plan for you</div>
          </div>
          <Icon
            name="mdi:chevron-right"
            size="18"
            class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors shrink-0"
          />
        </button>

        <button
          class="group flex items-center gap-4 px-4 py-3.5 rounded-2xl border-0 text-left hover:bg-white dark:hover:bg-white/5 transition-colors"
          @click="handleMobileLink('faq')"
        >
          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0"
          >
            <Icon name="mdi:help-circle-outline" size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-slate-900 dark:text-white">FAQ</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Common questions answered</div>
          </div>
          <Icon
            name="mdi:chevron-right"
            size="18"
            class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors shrink-0"
          />
        </button>
      </nav>

      <!-- CTA -->
      <div class="relative z-10 mt-auto px-5 pb-12 pt-6">
        <NuxtLinkLocale
          to="/onboarding"
          class="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.98] transition-all duration-200"
          @click="mobileMenuOpen = false"
        >
          {{ $t('common.actions.get_started') }}
          <Icon name="mdi:arrow-right" size="18" />
        </NuxtLinkLocale>

        <button
          type="button"
          class="flex items-center justify-center gap-2 w-full mt-3 py-4 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
          @click="handleMobileLogin"
        >
          <Icon name="mdi:login" size="18" />
          {{ $t('common.auth.login') }}
        </button>

        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">No credit card required</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
a {
  text-decoration: none;
}

button {
  border: none;
  cursor: pointer;
}

.mobile-menu-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
