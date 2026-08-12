---
title: Stránkování a filtrování
description: Procházejte kolekce článků a filtrujte je podle štítků.
order: 3
---

# Stránkování a filtrování

`GET /articles` přijímá parametry `page`, `limit` a `tag`. Výchozí velikost stránky je 10 a maximum 100.

```http
GET /api/v1/articles?page=2&limit=25&tag=ai,marketing
```

Více čárkou oddělených slugů štítků používá logiku AND: článek musí obsahovat všechny požadované štítky.

```json
{
  "data": [],
  "meta": {
    "total": 42,
    "page": 2,
    "limit": 25,
    "primaryLanguage": "cs",
    "appliedFilters": { "tags": ["ai", "marketing"] }
  }
}
```
