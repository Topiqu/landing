import type { ThemeKey } from '~~/shared/utils/plans'

export type SamplePlan = 'free' | 'pro' | 'premium'
export type SampleBlog = {
  theme: ThemeKey
  art: 'stripes' | 'arcs' | 'dots' | 'grid'
  plan: SamplePlan
  articles: number
  credits: number
  limit?: number
}

// Fictional client blogs behind the agency page illustrations; names and headlines live in `agencies.samples`.
// Credits stay within 1–3 per article so the numbers add up.
export const AGENCY_SAMPLE_BLOGS: readonly SampleBlog[] = [
  { theme: 'amber', art: 'stripes', plan: 'pro', articles: 24, credits: 58 },
  { theme: 'sky', art: 'arcs', plan: 'premium', articles: 26, credits: 78, limit: 80 },
  { theme: 'green', art: 'dots', plan: 'pro', articles: 30, credits: 44 },
  { theme: 'red', art: 'grid', plan: 'free', articles: 0, credits: 0 },
]
export const AGENCY_SAMPLE_PACKS = 6
