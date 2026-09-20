# Landing design system

The landing uses the same `@nuxt/ui@4.10.0` primitives as the application: `UApp`, `UHeader`, `UButton`, `UTabs`, and `UAccordion`. Navigation overlays, focus management, keyboard interactions and disclosure state are handled by the library rather than duplicated in landing components.

## Relationship to the application

The reference checkout is `../app`. Its `app.config.ts`, `assets/styles/main.css`, header, default layout, theme toggle, panel and article editor components informed this implementation.

- Keep the application's Manrope interface font, Source Serif 4 reading font, indigo/slate palette, 10px controls, 14px surfaces and 44px touch targets.
- The app header depends on authentication, tenant configuration, notifications and article state. Its editor depends on article composables, sources, translations and backend mutations. Do not import those feature components into this public, independently deployed repository.
- `ProductPreview` is explicitly an illustrative, locally switchable preview. It does not run an editor or make AI/publishing requests.
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
