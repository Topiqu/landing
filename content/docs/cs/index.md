---
title: Externí API
description: Napojte publikované články z Topiqu na svůj web nebo aplikaci.
order: 1
sitemap:
  loc: /cs/docs
  changefreq: monthly
---

# Tvořte s Topiqu

API je napojení, přes které si váš web, e-shop nebo aplikace bere hotové články z Topiqu sám. Články se pak zobrazují ve vašem designu a na vašich adresách a blog Topiqu nepotřebujete. Napojení jednou nastaví váš vývojář nebo agentura podle této dokumentace, po dohodě za příplatek i my. Na WordPressu a Shopify API řešit nemusíte: stačí plugin Topiqu Sync, nebo aplikace v Shopify. API je k dispozici od tarifu Starter.

Topiqu External API je REST API pro čtení obsahu publikovaného pro váš web a se správným klíčem i pro vytváření, publikaci a generování článků. API v1 představuje stabilní kontrakt: kompatibilní pole a endpointy můžeme přidávat beze změny URL, zatímco breaking změny dostanou novou hlavní verzi.

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
- Vytvářejte, publikujte a generujte články: [Zápis a generování](/cs/docs/writing).
- Otevřete kompletní [interaktivní API reference](/cs/api-reference).
- Sledujte změny API v [changelogu](/cs/changelog).
