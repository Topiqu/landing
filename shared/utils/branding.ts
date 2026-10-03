// Publication branding the platform (../app) accepts at signup. Mirrors shared/utils/publicationBranding.ts
// and the typography presets in shared/utils/tenantTheme.ts. Custom font files need an existing site, so
// onboarding offers the four built-in presets only.
export const TYPOGRAPHY_PRESETS = ['MODERN', 'EDITORIAL', 'MAGAZINE', 'SYSTEM'] as const
export type TypographyPreset = (typeof TYPOGRAPHY_PRESETS)[number]

export type BrandGradient = { colors: string[]; angle: number }
export const GRADIENT_STYLES = ['soft', 'deep', 'three'] as const
export type GradientStyle = (typeof GRADIENT_STYLES)[number]

const MODERN_FONT = '"Manrope Variable", ui-sans-serif, system-ui, sans-serif'
const EDITORIAL_FONT = '"Source Serif 4 Variable", Georgia, serif'
const SYSTEM_FONT = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export const typographyFonts = (preset: TypographyPreset) => {
  if (preset === 'EDITORIAL') return { heading: EDITORIAL_FONT, body: EDITORIAL_FONT }
  if (preset === 'SYSTEM') return { heading: SYSTEM_FONT, body: SYSTEM_FONT }
  if (preset === 'MAGAZINE') return { heading: EDITORIAL_FONT, body: MODERN_FONT }
  return { heading: MODERN_FONT, body: MODERN_FONT }
}

export const normalizeAccentColor = (value: unknown) =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null

export const mixBrandColor = (color: string, target: string, amount: number) =>
  `#${[1, 3, 5]
    .map((index) => {
      const source = Number.parseInt(color.slice(index, index + 2), 16)
      const destination = Number.parseInt(target.slice(index, index + 2), 16)
      return Math.round(source + (destination - source) * amount)
        .toString(16)
        .padStart(2, '0')
    })
    .join('')}`.toUpperCase()

// The same three presets the platform derives from the accent in Settings → Branding.
export const brandGradient = (style: GradientStyle, color: string): BrandGradient => {
  const accent = color.toUpperCase()
  if (style === 'deep') return { colors: [mixBrandColor(accent, '#0F172A', 0.45), accent], angle: 120 }
  if (style === 'three')
    return {
      colors: [accent, mixBrandColor(accent, '#FFFFFF', 0.55), mixBrandColor(accent, '#0F172A', 0.35)],
      angle: 90,
    }
  return { colors: [accent, mixBrandColor(accent, '#FFFFFF', 0.65)], angle: 135 }
}

export const gradientCss = (gradient: BrandGradient) =>
  `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`
