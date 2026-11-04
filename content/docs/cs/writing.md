---
title: Zápis a generování
description: Vytváření, úpravy, publikace a generování článků přes API.
order: 5
sitemap:
  loc: /cs/docs/writing
  changefreq: monthly
---

# Zápis a generování

Zápis vyžaduje klíč s oprávněním `WRITE`, publikace a plánování navíc `PUBLISH` a generování pomocí AI `GENERATE`. Viz [Autentizace](/cs/docs/authentication).

## Vytvoření článku

```bash
curl "https://app.topiqu.com/api/v1/articles" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: 4f1c2b1e-order-1234" \
  --data '{"title":"Jak zazimovat zahradní jezírko","content":"<p>…</p>","tags":["zahrada"]}'
```

Článek je koncept, dokud nepošlete `"status": "published"` nebo budoucí `releaseAt`. `content` je HTML a čistí se stejně jako obsah z editoru. `tags` jsou slugy štítků, které už na webu existují. Odpověď je `201` s článkem včetně `status` a `editVersion`.

## Úprava, publikace a stažení

```bash
curl -X PATCH "https://app.topiqu.com/api/v1/articles/ARTICLE_ID" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"status":"published","expectedVersion":3}'
```

Posílejte jen pole, která měníte. S `expectedVersion` (naposledy přečtená `editVersion`) vrátí mezitím provedená úprava `409` místo přepsání; bez něj vyhrává vaše úprava.

Pokud článek obsahuje obrázky, jejichž práva je potřeba potvrdit, publikace vrátí `409` s `code: MEDIA_RIGHTS_REVIEW_REQUIRED` a přehledem. Zkontrolujte ho a požadavek zopakujte s `"mediaRightsReview": {"fingerprint": "<report.fingerprint>", "acknowledged": true}`.

## Generování článku

```bash
curl "https://app.topiqu.com/api/v1/articles/generate" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: jezirko-zima-2026" \
  --data '{"topic":"Jak zazimovat zahradní jezírko","instructions":"Pro začátečníky, s kontrolním seznamem"}'
```

Požadavek se zařadí do fronty a odpověď je `202` s hlavičkou `Location`. Topiqu článek dohledá a napíše stejně jako autopilot a uloží ho jako koncept ke kontrole. Výsledek sledujte na `GET /api/v1/generations/{id}`, nebo lépe přes webhooky `generation.succeeded` a `generation.failed` v nastavení. Úspěšné generování obsahuje `articleId` konceptu; přečtete ho přes `GET /api/v1/articles/{id}`.

Každé generování čerpá kredity jednoho článku podle nastavené kvality webu. Požadavek se odmítne s `402`, když kredity nepokryjí jeho a všechny čekající požadavky, a s `429`, když jich už 5 čeká nebo běží.

## Bezpečné opakování

K zápisům posílejte hlavičku `Idempotency-Key` (libovolnou jedinečnou hodnotu pro každý požadavek); u generování je povinná. Když požadavek vyprší, zopakujte ho se stejným klíčem a tělem: do 24 hodin dostanete původní odpověď označenou `Idempotent-Replayed: true` a nic neproběhne dvakrát. Stejný klíč s jiným tělem vrací `422`.
