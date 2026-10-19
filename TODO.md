# Production follow-up

Implementation and operational instructions live in [docs/production.md](docs/production.md).
Measured accessibility/performance results live in [docs/production-audit.md](docs/production-audit.md).

## Platform work required

- Implement durable checkout idempotency across replicas, including Stripe customer/session creation
  and recovery after partial completion. Landing coalescing is process-local and is not a substitute.
- Add a documented email availability endpoint if an email preflight is desired. Checkout remains authoritative.
- Verify how the platform accepts `websiteUrl`: the inspected sibling checkout schema does not currently
  include this optional landing field, so confirmed knowledge import is not guaranteed by this repository.

## Deployment operations

- Configure the shared secret, platform URLs, SES sender and region, and Turnstile keys/hostname.
- Connect hosting JSON logs to retention and alerts for onboarding 5xx, email failures and unknown checkout outcomes.
- Verify SES delivery/bounce handling; SES acceptance alone does not confirm inbox delivery.
- Complete a staging registration with free and paid plans, timeout recovery and duplicate submissions.
- Check field Core Web Vitals after launch and verify the deployed site's cookie/locale behavior.

## Implemented checks

- CI: lint, unit tests, typecheck, OpenAPI validation, Docker production build and bilingual SSR smoke tests.
- Domain availability never reports success after a failed upstream check; retry is available in the UI.
- Checkout timeouts, no automatic mutation retries, process-local deduplication and uncertain-result feedback.
- Structured onboarding server logs with request IDs and no form/token/email logging.
- Shared design tokens, cookie-backed locale/color mode, onboarding reset and password-free draft persistence.

The landing proxies account creation to the platform. It does not need its own Prisma database,
password hashing implementation, Stripe integration or Resend dependency.
