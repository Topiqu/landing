export default defineNuxtConfig({
  compatibilityDate: '2026-05-21',

  devtools: { enabled: true },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || '',
    platformApiUrl: process.env.PLATFORM_API_URL || '',
    emailFrom: process.env.EMAIL_FROM || 'Topiqu <noreply@topiqu.com>',
    aws: {
      // SES_-prefixed (not AWS_*): on Vercel/Lambda the AWS_* names are reserved
      // and overwritten by the runtime — see server/utils/email.ts.
      region: process.env.SES_REGION || 'eu-central-1',
      accessKeyId: process.env.SES_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || '',
    },
    turnstile: { secretKey: process.env.TURNSTILE_SECRET_KEY || '' },
    public: {
      appVersion: '1.0.0 beta',
      cdnUrl: process.env.CDN_URL || 'https://cdn.topiqu.com',
      // Public URL of the main platform (existing-client login lives there)
      platformUrl: process.env.PLATFORM_URL || 'https://app.topiqu.com',
      // Better Stack status page — powers the header "Systems operational" pill
      statusUrl: process.env.STATUS_URL || 'https://status.topiqu.com',
      // Read by useCookieConsent; gtag itself stays in manual init mode.
      gtagId: process.env.GTAG_ID || '',
    },
  },

  // Cloudflare Turnstile (@nuxtjs/turnstile). Secret is read from
  // runtimeConfig.turnstile.secretKey above (baked from TURNSTILE_SECRET_KEY).
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY || '',
  },

  nitro: {
    preset: 'bun',
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxtjs/turnstile',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    'nuxt-security',
    'nuxt-toast',
    'nuxt-gtag',
    '@scalar/nuxt',
  ],

  scalar: {
    url: '/openapi/v1.json',
    pathRouting: { basePath: '/api-reference' },
    layout: 'docs',
    darkMode: true,
    showSidebar: true,
    hideClientButton: true,
    metaData: {
      title: 'Topiqu External API Reference',
      description: 'Interactive reference for the Topiqu External API v1.',
    },
  },

  image: {
    quality: 80,
    format: ['avif', 'webp'],
    domains: ['cdn.topiqu.com'],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280 },
  },

  typescript: {
    tsConfig: {
      include: ['../types/**/*.d.ts'],
    },
  },

  eslint: { config: { typescript: true } },

  css: ['~/assets/styles/base.scss'],

  security: {
    rateLimiter: {
      interval: 10 * 1000,
      tokensPerInterval: 70,
    },
    headers: {
      referrerPolicy: 'origin',
      xFrameOptions: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
        'connect-src': ["'self'", 'https:'],
        'frame-ancestors': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'blob:', 'https://challenges.cloudflare.com'],
      },
    },
    xssValidator: false,
  },

  routeRules: {
    // Keep the language-neutral developer URL useful.
    '/docs': { redirect: '/en/docs' },
    // Landing pages — prerender for instant TTFB
    // OAuth reviewers and crawlers must receive an HTTP redirect, not i18n's tiny
    // meta-refresh shell, otherwise they never inspect the actual public homepage.
    '/': { redirect: '/en' },
    '/en': { prerender: true },
    '/cs': { prerender: true },
    '/en/terms-of-service': { prerender: true },
    '/en/privacy-policy': { prerender: true },
    '/cs/obchodni-podminky': { prerender: true },
    '/cs/ochrana-soukromi': { prerender: true },
    // Nuxt build assets — immutable long cache
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Static public files (nitro routeRules don't support `**` inside a path
    // segment, so list each file explicitly)
    '/logo.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/app-logo.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/icon-192x192.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/icon-512x512.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/apple-touch-icon.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_404_rm.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_empty_rm.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_normal_rm.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_premysli_rm.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_smutny_rm.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // API rate limiting
    '/api/send-code': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60 * 60 * 1000 } },
    },
    '/api/verify-code': {
      security: { rateLimiter: { tokensPerInterval: 10, interval: 60 * 60 * 1000 } },
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'EN',
        files: ['en/common.json', 'en/landing.json', 'en/legal.json', 'en/languages.json'],
      },
      {
        code: 'cs',
        iso: 'cs-CZ',
        name: 'CZ',
        files: ['cs/common.json', 'cs/landing.json', 'cs/legal.json', 'cs/languages.json'],
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      cookieSecure: true,
      cookieCrossOrigin: true,
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    customRoutes: 'config',
    pages: {
      tos: {
        cs: '/obchodni-podminky',
        en: '/terms-of-service',
      },
      privacy: {
        cs: '/ochrana-soukromi',
        en: '/privacy-policy',
      },
      'onboarding/index': { cs: '/onboarding', en: '/onboarding' },
      'onboarding/site': { cs: '/onboarding/web', en: '/onboarding/site' },
      'onboarding/design': { cs: '/onboarding/design', en: '/onboarding/design' },
      'onboarding/account': { cs: '/onboarding/ucet', en: '/onboarding/account' },
      'onboarding/plan': { cs: '/onboarding/plan', en: '/onboarding/plan' },
      'onboarding/verify': { cs: '/onboarding/overeni', en: '/onboarding/verify' },
      'onboarding/summary': { cs: '/onboarding/prehled', en: '/onboarding/summary' },
    },
  },

  gtag: {
    // No script until the visitor accepts — `useCookieConsent` initializes it.
    initMode: 'manual',
    initCommands: [
      [
        'consent',
        'default',
        {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500,
        },
      ],
    ],
  },

  site: {
    name: 'Topiqu',
    description: 'AI content operations platform for researching, creating, reviewing, translating, publishing, and improving business content.',
    defaultLocale: 'en',
    indexable: true,
  },

  // Dynamické (island) OG obrázky nejsou na Nuxt 4.4 (unhead v2) funkční:
  // og-image 5.x padá na "Invalid island request hash", 6.x vyžaduje unhead v3.
  // Místo toho používáme statický og:image (viz app.vue). Až Nuxt přejde na
  // unhead v3, lze modul znovu zapnout a vrátit defineOgImage().
  ogImage: {
    enabled: false,
  },

  experimental: {
    renderJsonPayloads: true,
    headNext: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
      ],
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@unhead/schema-org/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@zxcvbn-ts/core',
        'slugify',
        'zod',
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Topiqu',
      short_name: 'Topiqu',
      description: 'AI content operations platform for researching, creating, reviewing, translating, publishing, and improving business content.',
      theme_color: '#2d5ebc',
      background_color: '#020408',
      display: 'standalone',
      icons: [
        { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/topiqu\.com\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 86400,
            },
          },
        },
      ],
    },
  },
})
