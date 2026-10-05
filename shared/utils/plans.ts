// Shared by the landing UI and its Nitro routes. Mirrors the platform (../app): prices from
// MAP.md "Stripe wiring", allowances from shared/utils/articleCredits.ts, packs from
// shared/utils/articlePacks.ts, trial from shared/utils/trial.ts. Change them together with
// the Stripe catalog.
export const TRIAL_DAYS = 14
export const TRIAL_ARTICLES = 5
export const ANNUAL_DISCOUNT_RATE = 0.2
export const ARTICLE_PACKS_USD = [
  { articles: 5, priceUsd: 8.99 },
  { articles: 12, priceUsd: 14.99 },
  { articles: 25, priceUsd: 22.49 },
] as const

// Keep these objects multi-line: mlly's export scanner swallows the next export after a
// single-line object with commas, which silently drops it from Nuxt auto-imports.
export const PLAN_PRICES_USD = {
  free: 0,
  pro: 49,
  premium: 99,
} as const
export const PLAN_ARTICLES = {
  pro: 30,
  premium: 50,
} as const
export const KNOWLEDGE_SOURCES = {
  pro: 50,
  premium: 200,
  custom: 500,
} as const
export const CONTENT_LANGUAGES = ['en', 'cs', 'de', 'fr'] as const

export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number]
export type BillingInterval = 'month' | 'year'
export type PricedPlan = keyof typeof PLAN_PRICES_USD

export const annualPlanPriceUsd = (monthlyPrice: number) =>
  Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT_RATE) * 100) / 100

export const formatUsd = (amount: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)

// Tenant themes from the platform's shared/utils/tenantTheme.ts (`themeColors`).
export const THEME_COLORS = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  teal: '#0d9488',
  green: '#16a34a',
  lime: '#65a30d',
  yellow: '#eab308',
  amber: '#f59e0b',
  orange: '#f97316',
  red: '#dc2626',
  pink: '#ec4899',
  purple: '#7c3aed',
  violet: '#8b5cf6',
  gray: '#6b7280',
} as const

export type ThemeKey = keyof typeof THEME_COLORS
