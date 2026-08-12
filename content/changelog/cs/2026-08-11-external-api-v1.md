---
title: External API v1
description: Stabilní a zdokumentovaný API kontrakt pro získávání publikovaných článků.
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

Přidali jsme první explicitně verzované Topiqu External API. Stávající integrace používající `/api/external` zůstávají funkční, nové integrace by měly používat `/api/v1`.

## Součástí vydání je

- Stabilní endpoint pro seznam publikovaných článků a získání článku podle ID.
- Konzistentní struktura článku v seznamu i detailu.
- Autentizace API klíčem přes hlavičku `x-api-key`.
- Stránkování a filtrování podle štítků.
- OpenAPI 3.1 specifikace ke stažení a interaktivní API reference.

```http
GET https://app.topiqu.com/api/v1/articles
```

Stávající klienti nemusí okamžitě migrovat. Přechod na v1 doporučujeme při nejbližší úpravě integrace.
