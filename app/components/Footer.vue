<script setup lang="ts">
const { reopen } = useCookieConsent()
const privacyPolicyUrl = usePrivacyPolicyUrl()
const { statusUrl } = useRuntimeConfig().public
const { data: system } = await useFetch('/api/status', { default: () => ({ status: 'operational' as const }) })
</script>
<template>
  <footer class="site-footer">
    <div class="landing-container">
      <div class="footer-top">
        <div>
          <BrandLogo />
          <p>{{ $t('landing.design.footerLabel') }}</p>
        </div>
        <nav :aria-label="$t('landing.design.nav.navigation')">
          <NuxtLinkLocale to="agencies">{{ $t('agencies.nav') }}</NuxtLinkLocale
          ><NuxtLinkLocale to="/docs">{{ $t('landing.design.nav.docs') }}</NuxtLinkLocale
          ><NuxtLinkLocale to="/changelog">Changelog</NuxtLinkLocale
          ><NuxtLinkLocale to="tos">{{ $t('common.links.terms') }}</NuxtLinkLocale
          ><a :href="privacyPolicyUrl">{{ $t('common.links.privacy') }}</a
          ><button type="button" @click="reopen">{{ $t('common.cookies.settings') }}</button>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Topiqu. {{ $t('landing.footer.rights') }}</p>
        <a :href="statusUrl" target="_blank" rel="noopener" class="system-status"
          ><span :data-status="system.status" />{{ $t('common.status.' + system.status) }}</a
        >
      </div>
    </div>
  </footer>
</template>
