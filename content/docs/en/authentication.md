---
title: Authentication
description: Authenticate safely with a Topiqu API key and choose its permissions.
order: 2
sitemap:
  loc: /en/docs/authentication
  changefreq: monthly
---

# Authentication

Every request requires an API key of the site you work with.

```http
x-api-key: YOUR_API_KEY
```

Create keys in your Topiqu settings under **Integrations → API Access**. Give each integration its own key, so you can revoke one without touching the others.

## Permissions

Each key has scopes. Every key can read; the rest is opt-in when you create it.

| Scope      | Allows                                                       |
| ---------- | ------------------------------------------------------------ |
| `READ`     | Published articles, tags and site details                    |
| `WRITE`    | Creating and editing drafts, and reading drafts              |
| `PUBLISH`  | Publishing, unpublishing and scheduling articles             |
| `GENERATE` | Asking Topiqu to write an article; uses your article credits |

`WRITE`, `PUBLISH` and `GENERATE` need the Pro plan. A key acts for the team member who created it: articles it creates are authored by that member, and it never does more than the member is allowed to. If the member loses a permission or leaves the site, the key loses it too.

## Keep keys server-side

The key is shown once, when you create it. Topiqu stores only a fingerprint of it and cannot show it again; if you lose it, create a new key and revoke the old one.

Treat the key like a password. Never commit it, include it in public client-side JavaScript, place it in a URL, or expose it in application logs. Requests should normally originate from your server.

Use an environment variable:

```bash
TOPIQU_API_KEY=your-key
```

Missing and invalid keys return `401 Unauthorized`; a key without the scope an endpoint needs returns `403 Forbidden`. Revoke a key immediately if it may have been disclosed; it stops working at once.

## Rate limits

Each key can send 120 requests per minute. Above that the API returns `429 Too Many Requests` with a `Retry-After` header.
