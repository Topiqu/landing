---
title: External API v1
description: A stable, documented API contract for retrieving published articles.
date: 2026-08-11
version: 1.0.0
type: new
areas:
  - api
  - integrations
breaking: false
featured: true
---

# External API v1

We introduced the first explicitly versioned Topiqu External API. Existing integrations using `/api/external` continue to work, while new integrations should use `/api/v1`.

## Included in this release

- Stable endpoints for listing published articles and retrieving an article by ID.
- Consistent article shapes across list and detail responses.
- API-key authentication through the `x-api-key` header.
- Pagination and tag filtering.
- A downloadable OpenAPI 3.1 specification and interactive API reference.

```http
GET https://app.topiqu.com/api/v1/articles
```

No migration is required for existing clients. We recommend moving to v1 when you next update your integration.
