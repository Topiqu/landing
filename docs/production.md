# Production operations

## Deployment and configuration

This repository serves the public landing, documentation and onboarding proxy. The platform
creates users and sites and owns Stripe. Do not add a second user database or Stripe integration here.
Deploy the Bun server or Docker image; a static-only deployment cannot serve registration endpoints.

Use Nuxt's native runtime environment overrides for an already-built image:

| Variable                                        | Purpose                                                    |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `NUXT_AUTH_SECRET`                              | Same signing secret as the platform's `AUTH_SECRET`        |
| `NUXT_PLATFORM_API_URL`                         | Server-side platform origin, e.g. `https://app.topiqu.com` |
| `NUXT_PUBLIC_PLATFORM_URL`                      | Public platform URL for sign-in                            |
| `NUXT_TURNSTILE_SECRET_KEY`                     | Cloudflare Turnstile secret                                |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY`                | Site key with the deployed hostname allowed                |
| `SES_REGION`                                    | SES identity region, normally `eu-central-1`               |
| `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY`    | Credentials allowed to send from the SES identity          |
| `NUXT_EMAIL_FROM`                               | Verified SES sender                                        |
| `NUXT_PUBLIC_GTAG_ID`                           | Optional analytics ID; loaded only after consent           |
| `NUXT_PUBLIC_STATUS_URL`, `NUXT_PUBLIC_CDN_URL` | Optional public service origins                            |

The legacy names in `nuxt.config.ts` supply build-time defaults. Prefer `NUXT_` overrides for
runtime configuration so secrets do not need to be baked into the build. `.env` files are excluded
from Docker's build context. Public runtime keys are visible in the browser and must never contain secrets.
The native color-mode module and i18n retain preferences in cookies.
Nuxt links prefetch on interaction rather than visibility, and Nitro emits gzip/Brotli versions of
public assets. Keep the reverse proxy/CDN configured to preserve content negotiation (`Vary: Accept-Encoding`).

Before enabling registration, verify the signing secret, platform connection, SES sender/region,
SES production access and Turnstile hostname. Development console email delivery is never used in production.

## Availability checks

`GET /api/check-domain` validates syntax locally, then calls the platform with a five-second timeout
and no automatic retry. Only a valid platform response can mark a domain as available. Missing configuration,
upstream errors and malformed responses return HTTP 503. The UI explains that availability is unknown,
offers a retry and prevents continuing until it is confirmed.

Email existence is still checked authoritatively at platform checkout. The optional legacy email
preflight currently fails open; the inspected platform has no `/api/users/check-email` route.

## Registration retries and their limits

The browser blocks double submission, uses no automatic retry and waits up to 35 seconds. The proxy
waits up to 30 seconds for the platform and explicitly disables mutation retries.

Within one running landing process, requests for the same verified email and identical validated
payload share one upstream call. Successful responses and uncertain failures are retained for ten minutes.
A changed payload for the same identity returns 409 while a retained request exists. Explicit upstream
4xx rejections release the slot so details can be corrected. At most 500 identities are retained; pending
entries are never evicted to make room. Only HMAC fingerprints and result promises are stored, not request bodies.
Login URLs in successful results remain private in process memory and must not be logged.

The proxy forwards `Idempotency-Key` and `X-Request-Id`. **The inspected platform does not yet consume
the idempotency key.** Its account/site transaction and duplicate checks help, but are not a durable
replay mechanism for account creation plus Stripe. The landing's protection is lost on restart and is
not shared by multiple replicas. A timeout can occur after the platform has committed the account.
The UI therefore reports an uncertain result and offers sign-in rather than claiming creation failed.

Required platform follow-up for full end-to-end idempotency:

- Atomically claim a unique idempotency key in shared durable storage and bind it to a payload fingerprint.
- Store progress and the successful redirect result; replay it for matching requests, reject changed payloads.
- Resume after partial completion; pass stable idempotency keys to Stripe customer/session creation.
- Test concurrent requests against multiple processes and a connection loss after the database commit.

Until that exists, do not advertise exactly-once registration across replicas. For an uncertain outcome,
check platform records and Stripe before manually replaying the operation.

## Server logs

Registration endpoints emit one JSON object per line to standard output/error. The deployment's normal
container or hosting log collector can ingest them; no external logging dependency or local log file is required.

Fields include `timestamp`, `service`, `action`, `requestId`, `status`, `durationMs`, `dependency` and `outcome`.
`X-Request-Id` is generated by the server, returned to the client and forwarded to platform checkout.
Queries, IP addresses, email addresses, passwords, verification codes, tokens, login URLs, request bodies
and raw provider errors are excluded. SES failures use an allowlisted provider error name (otherwise
`provider_error`); acceptance additionally includes its message and provider request IDs.
`email.accepted` means SES accepted the message, not that it reached the inbox. Configure SES delivery/bounce
events separately if delivery monitoring is needed.

Useful events:

- `http.request` / `http.response`: request start, status and latency for the four onboarding endpoints.
- `email.accepted` / `email.failed`: SES handoff outcomes.
- `checkout.completed` / `checkout.failed`: upstream checkout outcome and duration. `outcome: "unknown"`
  means the account may already exist.

Operational alerts should cover repeated 5xx responses, checkout unknown outcomes, email failures and
requests without a matching completion. Log emission is implemented here; log retention and alert delivery
must be configured in the hosting environment. Use platform-side correlation when investigating a request.

## Verification and release

Run `bun test`, `bun run lint`, `bun run typecheck`, `bun run openapi:check` and `bun run build`.
Start the built server (`PORT=3016 bun .output/server/index.mjs`) and run
`PRODUCTION_TEST_URL=http://127.0.0.1:3016 bun run test:production`.
CI already performs the rendering smoke test against the final Docker image.

On staging, verify a real free and paid registration, domain unavailability, expired/wrong codes,
SES/Turnstile failures, duplicate submissions and a platform connection loss. Do not run these mutations
against production accounts for a UI audit. Keep the previous image available for rollback.

For accessibility and performance, audit the **built production server**, not Nuxt dev mode:

- Check both locales, light/dark modes, keyboard-only navigation, 200% zoom and narrow screens.
- Run axe for confirmed violations; manually review inconclusive contrast results in decorative mockups.
- Run mobile Lighthouse for the landing and check the API reference separately (Scalar is client-only).
- Check reduced motion and that decorative animation stops offscreen. Inspect LCP, layout shifts and
  main-thread work; local Lighthouse is a lab measurement, not proof of real visitor performance.
- After deployment, use real visit data to track Core Web Vitals and registration failures.

Record measured results and remaining limitations in `docs/production-audit.md`.
