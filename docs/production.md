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

The verification step reads `GET /api/verification-config` with caching disabled. This endpoint exposes
only the public Turnstile site key from the running server, so navigating from a prerendered marketing
page does not reuse an old build-time key. Both Turnstile runtime variables must be set on the landing
application; restart/redeploy the container after updating them. An empty key prevents the browser from
requesting an email. The UI reports this as unavailable instead of claiming a message was sent.

The verification screen shows one sending indicator and concise persistent success/error feedback,
spam-folder guidance and a 60-second resend cooldown. Success requires an SES receipt, while development
console delivery is labelled separately. Failed resends preserve the previous challenge. Changing the email
cancels the pending browser request and clears verification state; an already accepted email cannot be recalled.

Verification tokens, checkout request signatures and idempotency fingerprints use the same secret resolver:
`NUXT_AUTH_SECRET` through runtime config, falling back to the legacy runtime `AUTH_SECRET`. A legacy-only
deployment must not verify an email successfully and then fail locally before forwarding checkout.

Email links enter the unguarded verification page (`/en/onboarding/verify-email` or
`/cs/onboarding/overit-email`) before the wizard requires a password. Credentials travel in the URL
fragment and are removed before the verification POST. The server validates the challenge and code,
then returns only the verified email and proof. An existing draft remains bound to its own email.
Older query links through the regular verification step redirect to this entry point. A same-origin
BroadcastChannel passes only the verified email and short-lived proof back to a matching active
verification tab. That tab keeps its password in memory and advances directly to review; the link tab
confirms where to continue after acknowledgement. A link opened inside a wizard that still has complete
account details advances directly to review. Otherwise, without an active matching tab, the link page
resumes account setup (or blog setup without a draft). Passwords are never transmitted between tabs, and
neither passwords nor verification proofs are persisted. Checkout still validates the signed proof on the server.

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
In Dokploy, inspect the **landing application's runtime/container logs**, rather than its build log or the
platform application's log. Better Stack receives these events only if an external collector forwards them;
the Better Stack status-page URL configured in this repository does not enable log forwarding.

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

When no `email.*` event appears, first check whether `http.request` with `POST /api/send-code` exists.
Only domain-check events mean the captured log does not show an email request. With no POST in browser
Network either, inspect the verification screen and its public configuration before diagnosing SES.
A POST without an email event can instead fail validation, Turnstile or the disposable-address check before SES.

Operational alerts should cover repeated 5xx responses, checkout unknown outcomes, email failures and
requests without a matching completion. Log emission is implemented here; log retention and alert delivery
must be configured in the hosting environment. Use platform-side correlation when investigating a request.

## Dokploy deployment

Use the Dockerfile build type with Dockerfile path `Dockerfile`, context `.`, and
build stage `release` (or leave the stage empty to use the final stage). The
application listens on container port `3000`; configure the Dokploy domain to use
that port. Runtime environment variables belong in the application's environment
settings, not Docker build arguments. Keep the existing `NUXT_` runtime variable
names documented above.

The Dockerfile uses BuildKit cache mounts for downloaded Bun packages and normal
Docker layer caching for installed dependencies. Repeated builds on the same
VPS/builder can reuse these caches; moving to another builder or pruning its cache
makes the next build cold. Keep normal build caching enabled. There is no dependency
on GitHub Actions cache or a registry cache exporter. The cache mount's architecture
suffix keeps package caches separate between ARM64 and AMD64 builders.

Both dependency installation and the Nuxt build run under Bun **1.4.3**. The build
uses `bun --bun run build` so the Nuxt CLI's Node shebang does not select Node.
No Node image or binary is needed. CI uses the same Bun version.

The previous `BUILD_NODE_OPTIONS` argument has been removed: Node's V8 heap flags
do not control Bun's JavaScriptCore heap. Remove that build argument in Dokploy if
it was configured. Size build resources through the builder/container limits and
allow room for native tools, Docker and running apps.

The final image runs as the existing `bun` user, with `NODE_ENV=production`,
`HOST=0.0.0.0` and `PORT=3000`. Only `.output` is copied from the build stage; Node,
source files and the package download cache stay out of the final image. The
application directory and copied output are owned by `bun` so Content can initialize
its generated SQLite database. Local `.data` is excluded from the build context.
Do not mount a host-owned directory over the application tree; any deliberate data
mount must allow writes by the container's `bun` user. Content's generated database
is derived from repository content and does not require a persistent volume.

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
