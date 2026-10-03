# Landing design system

The landing uses the same `@nuxt/ui@4.10.0` primitives as the application: `UApp`, `UHeader`, `UButton`, `UTabs`, and `UAccordion`. Navigation overlays, focus management, keyboard interactions and disclosure state are handled by the library rather than duplicated in landing components.

## Relationship to the application

The reference checkout is `../app`. Its `app.config.ts`, `assets/styles/main.css`, header, default layout, theme toggle, panel and article editor components informed this implementation.

- Keep the application's Manrope interface font, Source Serif 4 reading font, indigo/slate palette, 10px controls, 14px surfaces and 44px touch targets.
- The app header depends on authentication, tenant configuration, notifications and article state. Its editor depends on article composables, sources, translations and backend mutations. Do not import those feature components into this public, independently deployed repository.
- `Showcase` and the `AfterPublishing` dashboard are illustrative, coded mockups of the application (fictional tenant "Heatwise"). They mirror the app's sidebar, generation run panel, editor review and scheduling card, but run no editor and make no AI/publishing requests. Their demo copy lives under `landing.design.showcase.mock` and `after.dashboard`; shared primitives use the `mock-` prefix in `main.css`.
- `Connector` (right under the hero) shows scattered inputs (web, internal data, brand, Search Console) wired into the Topiqu mark and out to one finished article. It has two hand-placed compositions, `wide` and `tall`; wires are computed from the same coordinates and the stage scales to the container, so they always line up.
- The `AfterPublishing` query field is a canvas driven by `useCursorCanvas`. It drifts on its own on touch devices, draws a single static frame under reduced motion and only animates while visible. It is canvas-only on purpose, so repeated keywords never appear as hidden text in the HTML.
- Comparison prices for other tools come from their public pricing pages; update them together with the date in the table note.
- `HeroScene` is a pure CSS 3D floor of article cards below the hero copy (no WebGL dependency). The hero's `--hero-scene-band` reserves its space; animation pauses off-screen and stops under reduced motion, and the cursor tilt is disabled on touch devices.
- There is no testimonial or results section until there are real, consented quotes and measured data; do not add invented testimonials, customer logos or result metrics.
- Vue SFCs in this repo order blocks as `<template>`, `<script>`, `<style>`. Older files with script first are legacy.
- `BrandLogo` is the single logo component for the landing, footer, documentation and onboarding layouts.

## CSS coexistence

Nuxt UI's Tailwind utilities use the `tw:` prefix. Existing onboarding and documentation continue to use UnoCSS. The prefix prevents the two utility systems from redefining each other's classes. Do not use `ui:` as the Tailwind prefix: its generated color variables collide with Nuxt UI's own `--ui-color-*` variables.

Marketing tokens and layout live in `app/assets/styles/main.css`; global accessibility and form defaults live in `base.scss`. Avoid global selectors that recolor all `div`, `span` or `button` elements. The existing theme store remains the sole color-mode owner; Nuxt UI's color-mode module is disabled.

The original notification composable is named `useLegacyToast` so it cannot collide with Nuxt UI's `useToast`.

## Brand assets

Run `bun run scripts/sync-brand.ts` to sync the supplied artwork from `../app/public`, or pass an alternative source directory as the first argument. This is a development operation; builds require no sibling repository. Assets are copied without image manipulation. When replacing cached icons again, update their version query in `app.vue` and `nuxt.config.ts`, and update social-image dimensions if the source artwork changes.

Marketing copy lives under `landing.design` in both locale files. Plan details and the existing comparison data retain their original content.

The current logos are the user-supplied transparent exports (September 10, 2026). To refresh them, use `bun run scripts/sync-brand.ts C:/Users/kurib/Downloads --transparent`. The standard sibling-app sync replaces artwork, so use it only when that repository also contains the approved transparent assets.

Comparison logos are stored locally under `public/brand/products`; their official source URLs are recorded in `sources.json`. BlendScribe uses the CSS lettermark from its official homepage because its declared logo URL returns HTML. `ComparisonRating` uses plain scores and labels: 5/5 has a bold indigo score, 4/5 uses normal foreground, and lower tiers use secondary text. No filled rating tiles or repeated legend. The dark wordmark uses the supplied transparent full-logo export; its transparent margins are hidden by the logo component’s viewport without modifying the artwork.
