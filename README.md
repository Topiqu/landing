<h1 align="center">
  <a href="https://topiqu.com" target="_blank">
    <img align="center" src="https://skillicons.dev/icons?i=nuxt,vue,bun" /><br/><br/>
    <span>Topiqu - Landing</span>
  </a>
</h1>

### **Welcome** to <a href="https://topiqu.com" target="_blank">**Topiqu**</a>! 👋

Landing page and onboarding flow for **Topiqu - Your AI Blog Platform**.

**Includes:**

- Marketing landing page - workspace preview, editorial workflow, comparison, pricing and FAQ
- 6-step onboarding - site setup, design, account, plan, email verification, summary
- Optional company website - saved with the new project and offered for a confirmed knowledge import in the app
- Legal pages - Terms of Service, Privacy Policy
- PWA support, SEO/OG meta, structured data (schema.org)
- i18n - Multi-language localization

The landing shares Nuxt UI primitives and the visual language of the app. See [the design system notes](docs/design-system.md) for component reuse, CSS conventions and logo synchronization.

## 🛠️ Installation

**Requirements**

- 📦 [Bun](https://bun.sh) - package manager & runtime
- 🔑 A configured `.env` (see `.env.example`)

**Install & run in dev mode**

```bash
bun install   # installs deps + runs nuxt prepare
bun dev       # start Nuxt dev server
```

**Build & preview**

```bash
bun run build   # production server build (Bun preset)
bun generate    # static site generation
bun preview     # preview production build locally
```

Docker builds Nuxt with Node 24 and runs the standalone server with Bun 1.4.2.
Nuxt Content uses the built-in SQLite driver in both stages.

Check the packaged production server with the same image used for deployment:

```bash
docker build --tag topiqu-landing:smoke .
docker run --detach --rm --name topiqu-landing-smoke --publish 127.0.0.1:3000:3000 topiqu-landing:smoke
bun run test:production
docker stop topiqu-landing-smoke
```

The smoke test checks server rendering of all six onboarding steps in English and Czech,
documentation, changelog and the 404 page. Set `PRODUCTION_TEST_URL` to test a different local
port. CI runs it against the final Docker image so development dependencies cannot mask missing
runtime dependencies.

## 🔑 Environment Variables

Copy `.env.example` and fill in:

| Variable                           | Description                                             |
| ---------------------------------- | ------------------------------------------------------- |
| `CDN_URL`                          | CDN base URL for assets                                 |
| `TURNSTILE_SECRET_KEY`             | Cloudflare Turnstile secret (onboarding bot protection) |
| `TURNSTILE_SITE_KEY`               | Cloudflare Turnstile site key                           |
| `AUTH_SECRET`                      | HMAC signing secret shared with the platform            |
| `PLATFORM_API_URL`                 | Main Topiqu platform URL (receives checkout data)       |
| `SES_REGION`                       | Amazon SES region (`eu-central-1` for Frankfurt)        |
| `SES_ACCESS_KEY_ID`                | IAM access key with permission to send through SES      |
| `SES_SECRET_ACCESS_KEY`            | IAM secret access key for SES                           |
| `EMAIL_FROM`                       | Sender address for verification emails                  |
| `GTAG_ID`                          | Google Analytics measurement ID (`G-XXXXXXXXXX`)        |
| `NUXT_PUBLIC_ADSENSE_PUBLISHER_ID` | AdSense account (defaults to `ca-pub-9731440718321055`) |

AdSense publishes its account meta tag during server rendering. The script loads once after
hydration and cookie consent; withdrawing consent reloads the page to stop the advertising runtime.
Privacy policy pages exclude both AdSense and GA4, including when a visitor has already consented;
entering a policy page after either runtime has loaded reloads the page to stop it.
`public/ads.txt` authorizes the same publisher. Google advertising consent still requires a
published Google CMP message for `topiqu.com` (AdSense → Privacy & messaging).

After SES accepts a verification email, the server logs `[SES] Verification email accepted`
with the SES `messageId` and sending region. The `/api/send-code` response includes
`delivery: "ses"` and `messageId`; this confirms SES acceptance, not inbox delivery.
In local development without SES credentials, the code is printed to the terminal
as `[DEV EMAIL]` instead of being sent,
and the response explicitly reports `delivery: "development"`.

## 🧹 Linting & Formatting

ESLint (`@nuxt/eslint`) + Prettier enforced project-wide.

```bash
bun lint           # check
bun lint:fix       # auto-fix
bun prettier       # check formatting
bun prettier:fix   # apply formatting
bun fmt            # lint:fix + prettier:fix combined
bun typecheck      # vue-tsc strict typecheck
```

---

<p align="center">
    <span>Made with ❤️ by</span>
    <a href="https://github.com/bigjohnn1" target="_blank">@bigjohnn1</a>
    <span>&</span>
    <a href="https://github.com/germondai" target="_blank">@germondai</a>
</p>
