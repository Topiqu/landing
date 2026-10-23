# Production audit — 2026-10-19

Scope: this landing repository, served from its built Bun production server on localhost.
No real accounts, verification emails or payments were created. The platform repository was inspected
read-only to verify the checkout boundary; it was not modified.

## Automated verification

- 27 unit tests pass, including domain upstream failure/malformed responses, checkout concurrency,
  successful replay, uncertain outcomes, retention limits and expiry, and sensitive-data exclusion from SES logs.
- ESLint, Nuxt typecheck and OpenAPI validation pass.
- Production build passes. The bilingual production rendering smoke test passes, including a 404
  and onboarding response `X-Request-Id` / `Cache-Control: no-store` checks.
- Observed request/response JSON logs contain matching server-generated request IDs and duration/status.

## Mobile performance

Lighthouse 13.5.0, headless Chromium, default mobile simulated throttling (150 ms RTT,
1,638.4 Kbps throughput, 4× CPU slowdown), `/en` on the production server.
Each column is one lab run; this is not a field percentile or a guarantee about deployed CDN performance.

| Metric                   | Before compression / interaction prefetch | After     |
| ------------------------ | ----------------------------------------- | --------- |
| Performance score        | 55                                        | 78        |
| Accessibility score      | 100                                       | 100       |
| Largest Contentful Paint | 10.8 s                                    | 4.7 s     |
| First Contentful Paint   | 7.4 s                                     | 3.0 s     |
| Total Blocking Time      | 190 ms                                    | 60 ms     |
| Cumulative Layout Shift  | 0.001                                     | 0.001     |
| Total transfer           | 1,799,553 B                               | 590,812 B |

Nitro now generates compressed assets; the production server's Brotli content negotiation and
`Vary: Accept-Encoding` were verified. Link prefetch is triggered by interaction rather than visibility.

**Performance is improved, not finished:** 4.7-second mobile lab LCP is still above the good target.
Remaining opportunities are initial render-blocking CSS, the entry JavaScript bundle and oversized
logo transfers. Consider native Nuxt Image sizing, critical-font prioritization and deferring onboarding
store/password-analysis code until signup interaction, then remeasure. No image assets were rewritten
and no dependency was added for this audit. Real INP needs field data; lab TBT is not INP.

## Accessibility and layout

Axe 4.12.1 with WCAG 2 A/AA rules:

| Page / scenario                                                  | Confirmed violations after fixes |
| ---------------------------------------------------------------- | -------------------------------- |
| English homepage, light desktop                                  | 0                                |
| English homepage, dark 390px viewport, after transitions settled | 0                                |
| Czech documentation home, dark mobile                            | 0                                |
| English onboarding site step, dark mobile                        | 0                                |

Fixed the article mockup's contrast using theme-aware accent/success tokens. Added keyboard skip links
to documentation and onboarding, focusable skip targets and a keyboard-focusable scrollable code example.
The documentation skip link was tested with Tab/Enter and focused `developer-content` correctly.

No horizontal overflow was observed on the checked documentation/onboarding pages at 320px or the
homepage at 390px. Reduced-motion emulation pauses the hero scene. The domain-check failure scenario
was tested with an aborted browser request: an unavailable message and retry action appeared and
Continue remained disabled. A subsequent mocked successful retry enabled Continue.

Some decorative mockup contrast checks remain inconclusive because overlapping imagery prevents axe
from determining a background. Running axe during the connector's entrance fade also produces transient
contrast findings; final readings above were taken after transitions settled. These results do not replace
manual screen-reader testing, browser zoom testing or Safari/Firefox device checks.

### Scalar API reference: known accessibility issues

The Czech API reference produced three rule types inside third-party Scalar components:

- `aria-input-field-name` and `aria-required-attr` on its API-key combobox.
- `button-name` on four icon controls.

These need a supported Scalar fix/update and regression check. No brittle runtime DOM relabeling or
unreviewed dependency upgrade was introduced. The API reference must not be described as fully WCAG-conformant.

## Remaining release work outside the landing

- The platform must implement durable checkout idempotency and resumable Stripe creation across replicas.
  The landing's ten-minute, process-local protection does not provide that guarantee.
- Configure hosting log retention and alert delivery; emitting logs does not itself page an operator.
- Validate real SES delivery, Turnstile and free/paid registrations on staging with production-like secrets.
- The inspected platform checkout schema does not accept the optional `websiteUrl`; verify that contract
  before promising a saved website source/knowledge import.

See [production operations](production.md) for configuration, logs, timeout behavior and recovery instructions.
