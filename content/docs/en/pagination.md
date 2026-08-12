---
title: Pagination & filtering
description: Navigate article collections and filter them by tags.
order: 3
---

# Pagination & filtering

`GET /articles` accepts `page`, `limit`, and `tag` query parameters. The default page size is 10 and the maximum is 100.

```http
GET /api/v1/articles?page=2&limit=25&tag=ai,marketing
```

Multiple comma-separated tag slugs use AND semantics: an article must contain every requested tag.

```json
{
  "data": [],
  "meta": {
    "total": 42,
    "page": 2,
    "limit": 25,
    "primaryLanguage": "en",
    "appliedFilters": { "tags": ["ai", "marketing"] }
  }
}
```
