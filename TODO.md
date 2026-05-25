# TODO — Topiqu Landing

Tasks required before the project is fully operational, grouped by priority.

---

## 🔴 Critical — Onboarding won't work without these

### Server API — DB + Stripe integration needed

This is a full-stack Nuxt app. The three server routes exist but their business logic is currently stubbed out (domain/email checks fail open; checkout proxies to a `PLATFORM_API_URL` that doesn't exist yet). Each needs real implementation:

#### `GET /api/check-domain` → `server/api/check-domain.get.ts`

- Format validation is done. The `isDomainTaken()` helper currently calls `PLATFORM_API_URL` — replace with a direct DB query.
- Add a DB client (e.g. Prisma, Drizzle) and query the sites table: `WHERE domain = fullDomain`.

#### `POST /api/send-code` → `server/api/send-code.post.ts`

- The `isEmailRegistered()` helper currently calls `PLATFORM_API_URL` — replace with a direct DB query.
- Query the users table: `WHERE email = email`.

#### `POST /api/checkout` → `server/api/checkout.post.ts`

- Currently proxies to `PLATFORM_API_URL`. Replace with direct implementation:
  1. **Create user** — hash password (e.g. `argon2.hash(password)`), insert into users table.
  2. **Create site** — insert into sites table with `domain`, `language`, `theme`, `focus`.
  3. **Stripe** — if `selectedPlan` is PRO or PREMIUM, create a Stripe checkout session (`stripe.checkout.sessions.create`) and return `{ url: session.url }`. For free plan, generate a login token and return `{ url: '/dashboard' }`.
  4. Remove `signLandingRequest()` and the `PLATFORM_API_URL` proxy once this is self-contained.

#### Suggested packages

```
bun add prisma @prisma/client argon2 stripe
```

### Environment variables (all required in production)

Set these on Vercel (and locally in `.env`):

```
AUTH_SECRET=          # shared with platform for verifiedToken signing
PLATFORM_API_URL=     # e.g. https://app.topiqu.com
RESEND_API_KEY=       # from resend.com
EMAIL_FROM=           # e.g. Topiqu <noreply@topiqu.com>
TURNSTILE_SECRET_KEY= # from cloudflare.com/turnstile
GTAG_ID=              # Google Analytics measurement ID (G-XXXXXXXX)
```

---

## 🟠 High — Broken UX or missing functionality

### ~~Onboarding step guards~~ ✅

~~Users can navigate directly to any step URL without completing earlier steps.~~ Done — `app/middleware/onboarding-guard.ts` redirects to the first incomplete step.

### ~~Form state lost on page refresh~~ ✅

~~`pinia-plugin-persistedstate` is already installed but not wired up.~~ Done — `app/plugins/pinia-persistedstate.client.ts` + `persist: { pick: ['form'] }` on the onboarding store.

### ~~Mobile navigation~~ ✅

~~The entire header nav is `hidden md:flex`. There is no hamburger menu or mobile drawer.~~ Done — `Header.vue` has a slide-in mobile overlay with the same links + CTA.

### ~~Hardcoded English strings in `index.vue`~~ ✅

~~The `#specs` section has strings that bypass i18n.~~ Done — security list items and the `JSON/REST` badge now use `landing.specs.security.list.*` and `landing.specs.api.type` keys.

---

## 🟡 Medium — Works but incomplete

### ~~PWA icons missing~~ ✅

Generated from `public/app-logo.png` (1024×1024) using `sips`: `icon-192x192.png`, `icon-512x512.png`, `apple-touch-icon.png` are now in `public/`. Manifest and head link already configured in `nuxt.config.ts`.

### ~~OG images never set~~ ✅

~~`defineOgImage()` was never called on any page.~~ Done — `index.vue`, `tos.vue`, and `privacy.vue` now call `defineOgImage()`. `nuxt-og-image` generates them dynamically at request time using the page title/description from `useSeoMeta`.

### ~~SEO meta missing on onboarding pages~~ ✅

~~No `useSeoMeta()` call on any onboarding step page.~~ Done — onboarding layout sets `robots: noindex, nofollow`. `index.vue`, `tos.vue`, and `privacy.vue` each call `useSeoMeta`.

### ~~Google Tag / Analytics not configured~~ ✅

~~`nuxt-gtag` module is loaded but no measurement ID is set.~~ Done — `gtag.id` reads from `process.env.GTAG_ID`. Set `GTAG_ID=G-XXXXXXXX` in `.env` to activate.

### ~~`site.defaultLocale` mismatch~~ ✅

~~`nuxt.config.ts` sets `site.defaultLocale: 'cs'` but `i18n.defaultLocale` is `'en'`.~~ Done — both now use `'en'`.

### Google AdSense ID in `public/ads.txt`

`ads.txt` contains a hardcoded publisher ID (`pub-9286243311790870`). Verify this is the correct account or update it.

---

## 🔵 Low — Polish and deployment

### Resend domain verification

Add and verify a sending domain in the Resend dashboard so verification emails land in inboxes rather than spam. Update `EMAIL_FROM` to use that domain.

### Custom domain DNS verification flow

When a user chooses a custom domain in the onboarding, there is no post-signup flow to guide them through adding DNS records. This was in the original platform. Needs a dashboard screen on the platform side.

### ~~`X-Landing-Secret` hardening~~ ✅

~~The landing authenticated itself to the platform with a plain `X-Landing-Secret` header.~~ Done — replaced with short-lived HMAC: `X-Landing-Timestamp` + `X-Landing-Sig` generated by `server/utils/landingAuth.ts`. The platform must verify: `HMAC-SHA256(authSecret, timestamp) === sig` and `|Date.now() - timestamp| < 5min`.

### Vercel deployment

- Create Vercel project linked to this repo
- Set all env vars in the Vercel dashboard
- Configure custom domain + DNS

### Czech translation review

~~New keys added (`common.status.operational`, `common.actions.openMenu`, `landing.specs.api.type`, onboarding route slugs) need a native-speaker review pass.~~

### `pinia-plugin-persistedstate` unused import

~~The package is in `dependencies` but nothing uses it yet.~~ Done — wired up.
