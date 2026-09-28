const LABELS = {
  en: {
    types: {
      new: 'New',
      improved: 'Improved',
      fixed: 'Fixed',
      deprecated: 'Deprecated',
      breaking: 'Breaking',
      security: 'Security',
    },
    areas: {
      ai: 'AI',
      analytics: 'Analytics',
      api: 'API',
      billing: 'Billing',
      editor: 'Editor',
      integrations: 'Integrations',
      languages: 'Languages',
      publishing: 'Publishing',
      seo: 'SEO & visibility',
      team: 'Team',
    },
  },
  cs: {
    types: {
      new: 'Novinka',
      improved: 'Vylepšení',
      fixed: 'Oprava',
      deprecated: 'Končí',
      breaking: 'Nekompatibilní změna',
      security: 'Bezpečnost',
    },
    areas: {
      ai: 'AI',
      analytics: 'Analytika',
      api: 'API',
      billing: 'Platby',
      editor: 'Editor',
      integrations: 'Integrace',
      languages: 'Jazyky',
      publishing: 'Publikace',
      seo: 'SEO a viditelnost',
      team: 'Tým',
    },
  },
} as const

const labelsFor = (locale: string) => (locale === 'cs' ? LABELS.cs : LABELS.en)

export const changelogTypeLabel = (locale: string, type: string) =>
  (labelsFor(locale).types as Record<string, string>)[type] ?? type

export const changelogAreaLabel = (locale: string, area: string) =>
  (labelsFor(locale).areas as Record<string, string>)[area] ?? area
