---
title: Authentication
description: Authenticate safely with a Topiqu site API key.
order: 2
---

# Authentication

Every request requires the API key belonging to the site whose articles you want to retrieve.

```http
x-api-key: YOUR_API_KEY
```

## Keep keys server-side

Treat the key like a password. Never commit it, include it in public client-side JavaScript, place it in a URL, or expose it in application logs. Requests should normally originate from your server.

Use an environment variable:

```bash
TOPIQU_API_KEY=your-key
```

Missing and invalid keys return `401 Unauthorized`. Rotate a key immediately if it may have been disclosed; the previous key stops working after rotation.
