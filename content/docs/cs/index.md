---
title: Externí API
description: Napojte publikované články z Topiqu na svůj web nebo aplikaci.
order: 1
---

# Tvořte s Topiqu

Topiqu External API je read-only REST API pro získávání obsahu publikovaného pro váš web. API v1 představuje stabilní kontrakt: kompatibilní pole a endpointy můžeme přidávat beze změny URL, zatímco breaking změny dostanou novou hlavní verzi.

## Základní URL

```text
https://app.topiqu.com/api/v1
```

## První požadavek

V nastavení webu v Topiqu vytvořte API klíč a pošlete jej v hlavičce `x-api-key`.

```bash
curl "https://app.topiqu.com/api/v1/articles?limit=10" \
  --header "x-api-key: YOUR_API_KEY"
```

API vrací JSON. Data používají ISO 8601 v UTC, seznamy obsahují metadata stránkování a klient musí ignorovat neznámá pole odpovědi.

## Další kroky

- Před použitím produkčního klíče si přečtěte [Autentizaci](/cs/docs/authentication).
- Projděte si [stránkování a filtrování](/cs/docs/pagination).
- Otevřete kompletní [interaktivní API reference](/api-reference).
- Sledujte změny API v [changelogu](/cs/changelog).
