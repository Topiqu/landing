export default defineNuxtConfig({
  compatibilityDate: '2026-05-21',

  devtools: { enabled: true },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || '',
    platformApiUrl: process.env.PLATFORM_API_URL || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'Topiqu <noreply@topiqu.com>',
    turnstile: { secretKey: process.env.TURNSTILE_SECRET_KEY || '' },
    public: {
      appVersion: '1.0.0 beta',
      cdnUrl: process.env.CDN_URL || 'https://cdn.topiqu.com',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
    },
  },

  nitro: {
    $development: {
      preset: 'bun',
    },
    $production: {
      preset: 'vercel',
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    'nuxt-security',
    'nuxt-toast',
    'nuxt-gtag',
  ],

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
    // Landing pages — prerender for instant TTFB
    '/': { prerender: true },
    '/en': { prerender: true },
    '/cs': { prerender: true },
    '/en/terms-of-service': { prerender: true },
    '/en/privacy-policy': { prerender: true },
    '/cs/obchodni-podminky': { prerender: true },
    '/cs/ochrana-soukromi': { prerender: true },
    // Nuxt build assets — immutable long cache
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Static public files
    '/icon-**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/logo.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/topik_**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
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
    id: process.env.GTAG_ID || '',
  },

  site: {
    name: 'Topiqu AI Blog',
    description: 'Moderní blogovací platforma poháněná AI',
    defaultLocale: 'en',
    indexable: true,
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
      name: 'Topiqu AI Blog',
      short_name: 'Topiqu',
      description: 'Moderní blogovací platforma poháněná AI',
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
