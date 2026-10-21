# Landing performance — 2026-10-21

Measured against `49a1e28` using the built Bun server at `http://127.0.0.1:3016/en`.
Lighthouse 13.5.0, headless Chromium 1248, default simulated mobile throttling
(150 ms RTT, 1,638.4 Kbps, 4× CPU). Runs are sequential, without other browser QA
or builds running concurrently. These are local lab results, not deployed field data.

## Changes

- Enable Nuxt UI component detection to generate styles for components used by the app.
- Allow native Nuxt SSR style inlining; UnoCSS otherwise disables it. Blocking stylesheet
  requests fall from six to three. Inlining increases compressed HTML size; the measurement
  includes that cost. No runtime CSS removal or custom critical CSS pipeline.
- Hydrate lower homepage sections when visible. Their HTML still renders on the server.
  Keep the hero, header and geometry-dependent connector eager.
- Load signup state/password analysis on hero form submission and preserve Nuxt context.
- Preload the existing Latin interface font.
- Use existing Nuxt Image for appropriately sized WebP logo variants at 1× and 2× density.
  Keep SVGs as vectors and retain original source files. Do not pass version queries to
  local IPX source paths: they are treated as literal filenames during prerendering.
- Cache unhashed brand/optimized image paths for one day with revalidation; they are not
  immutable. Allow for this cache lifetime when replacing brand source files.
- Extend the production smoke check to fetch optimized images and their retina variants.

No dependencies were added. `AfterPublishing.vue` and its spacing were not changed.

## Mobile lab results

| Variant                                          | Performance |   FCP |   LCP |   TBT |   CLS |  Transfer |
| ------------------------------------------------ | ----------: | ----: | ----: | ----: | ----: | --------: |
| Baseline                                         |          78 | 3.0 s | 4.7 s | 64 ms | 0.001 | 592,795 B |
| UI component detection                           |          79 | 2.9 s | 4.5 s | 63 ms | 0.001 | 583,689 B |
| SSR styles, deferred hydration and font priority |          80 | 2.6 s | 4.5 s | 57 ms |     0 | 576,617 B |
| Final, including sized images                    |          84 | 2.6 s | 3.9 s | 63 ms |     0 | 441,315 B |
| Final repeat                                     |          84 | 2.6 s | 4.0 s | 60 ms |     0 | 441,315 B |

The hydration checkpoint also deferred the connector. The final version keeps it eager
because it calculates its layout from the mounted frame dimensions. The final result is
therefore the relevant complete implementation, not a sum of independent improvements.
Accessibility scored 100 in all runs; this does not establish full WCAG conformance.

The final desktop preset run scored **99 performance / 100 accessibility**, with FCP
0.6 s, LCP 0.9 s, TBT 0 ms and CLS 0. No desktop baseline was measured locally for
this change; the supplied deployed PageSpeed score is not a controlled comparison.

## Reproduction

```sh
bun run build
PORT=3016 bun .output/server/index.mjs
# In another terminal:
PRODUCTION_TEST_URL=http://127.0.0.1:3016 bun run test:production
CHROME_PATH=/path/to/chrome bunx lighthouse http://127.0.0.1:3016/en \
  --chrome-flags='--headless --no-sandbox' --output=json \
  --output-path=/tmp/topiqu-performance.json \
  --only-categories=performance,accessibility --quiet
```

Also run `bun test`, `bun run lint`, `bun run typecheck` and `bun run openapi:check`.
The smoke script checks both locales, docs, release articles, onboarding routes, 404,
optimized images and onboarding response correlation/cache headers. CI repeats it against
its final Linux deployment image; the local test uses the macOS production build.

## Functional verification

Production build, 27 unit tests, lint, typecheck, OpenAPI and bilingual rendering/image
smoke checks passed. Browser checks covered 390px light and 1440px dark home layouts,
loaded logos, no horizontal overflow, yearly billing, comparison tabs and FAQ expansion.
Submitting the Czech hero email form navigated to `/cs/onboarding/web` without browser
errors. No real registration, payment or email was sent.

## Remaining limits

Mobile LCP is still above the good threshold. The initial framework/UI JavaScript and
remaining three small blocking stylesheets are further opportunities. Avoid rewriting
header/modal infrastructure just to chase a single Lighthouse score. Validate deployed
cache headers, compression and mobile field LCP/INP after release. Cloudflare's injected
email decoding script is controlled at the hosting layer; this repository does not remove it.
See the [earlier production audit](production-audit.md) for outstanding Scalar accessibility
and platform release requirements.
