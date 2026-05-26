<h1 align="center">
  <a href="https://topiqu.com" target="_blank">
    <img align="center" src="https://skillicons.dev/icons?i=nuxt,vue,bun" /><br/><br/>
    <span>Topiqu - Landing</span>
  </a>
</h1>

### **Welcome** to <a href="https://topiqu.com" target="_blank">**Topiqu**</a>! 👋

Landing page and onboarding flow for **Topiqu - Your AI Blog Platform**.

**Includes:**
- Marketing landing page - Hero, Specs bento grid, Pricing, FAQ
- 6-step onboarding - site setup, design, account, plan, email verification, summary
- Legal pages - Terms of Service, Privacy Policy
- PWA support, SEO/OG meta, structured data (schema.org)
- i18n - Multi-language localization

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
bun run build   # production server build (Vercel preset)
bun generate    # static site generation
bun preview     # preview production build locally
```

## 🔑 Environment Variables

Copy `.env.example` and fill in:

| Variable               | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `CDN_URL`              | CDN base URL for assets                                 |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (onboarding bot protection) |
| `TURNSTILE_SITE_KEY`   | Cloudflare Turnstile site key                           |
| `AUTH_SECRET`          | HMAC signing secret shared with the platform            |
| `PLATFORM_API_URL`     | Main Topiqu platform URL (receives checkout data)       |
| `RESEND_API_KEY`       | Resend API key for email verification                   |
| `EMAIL_FROM`           | Sender address for verification emails                  |
| `GTAG_ID`              | Google Analytics measurement ID (`G-XXXXXXXXXX`)        |

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
