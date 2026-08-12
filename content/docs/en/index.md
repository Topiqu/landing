---
title: External API
description: Integrate published Topiqu articles into your website or application.
order: 1
---

# Build with Topiqu

The Topiqu External API is a read-only REST API for retrieving content published for your site. API v1 is designed as a stable contract: compatible fields and endpoints can be added without changing the URL, while breaking changes will ship under a new major version.

## Base URL

```text
https://app.topiqu.com/api/v1
```

## First request

Create an API key in your Topiqu site settings and send it in the `x-api-key` header.

```bash
curl "https://app.topiqu.com/api/v1/articles?limit=10" \
  --header "x-api-key: YOUR_API_KEY"
```

The API returns JSON. Dates use ISO 8601 in UTC, list endpoints include pagination metadata, and unknown response fields should be ignored by clients.

## Next steps

- Read [Authentication](/en/docs/authentication) before handling a production key.
- Learn how [pagination and filtering](/en/docs/pagination) work.
- Open the full [interactive API reference](/api-reference).
- Follow API changes in the [changelog](/en/changelog).
