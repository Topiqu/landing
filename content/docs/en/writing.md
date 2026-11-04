---
title: Writing & generating
description: Create, edit, publish and generate articles through the API.
order: 5
sitemap:
  loc: /en/docs/writing
  changefreq: monthly
---

# Writing & generating

Writing needs a key with the `WRITE` scope; publishing and scheduling also `PUBLISH`, and AI generation `GENERATE`. See [Authentication](/en/docs/authentication).

## Create an article

```bash
curl "https://app.topiqu.com/api/v1/articles" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: 4f1c2b1e-order-1234" \
  --data '{"title":"How to winter-proof a garden pond","content":"<p>…</p>","tags":["garden"]}'
```

The article is a draft unless you send `"status": "published"` or a future `releaseAt`. `content` is HTML and is cleaned like content from the editor. `tags` are slugs of tags that already exist on the site. The response is `201` with the article, including `status` and `editVersion`.

## Edit, publish or unpublish

```bash
curl -X PATCH "https://app.topiqu.com/api/v1/articles/ARTICLE_ID" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"status":"published","expectedVersion":3}'
```

Send only the fields you change. With `expectedVersion` (the `editVersion` you last read), an edit made in the meantime returns `409` instead of being overwritten; without it, your update wins.

If the article uses images whose rights need confirming, publishing returns `409` with `code: MEDIA_RIGHTS_REVIEW_REQUIRED` and a report. Check it, then repeat the request with `"mediaRightsReview": {"fingerprint": "<report.fingerprint>", "acknowledged": true}`.

## Generate an article

```bash
curl "https://app.topiqu.com/api/v1/articles/generate" \
  --header "x-api-key: $TOPIQU_API_KEY" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: pond-winter-2026" \
  --data '{"topic":"How to winter-proof a garden pond","instructions":"For beginners, with a checklist"}'
```

The request is queued and answered with `202` and a `Location` header. Topiqu researches and writes the article like its autopilot does and saves it as a draft for you to review. Follow the result at `GET /api/v1/generations/{id}` or, better, subscribe to the `generation.succeeded` and `generation.failed` webhooks in your settings. A succeeded generation carries the draft's `articleId`; read it with `GET /api/v1/articles/{id}` using a key that also has `WRITE`. A GENERATE-only key can request articles and read generation status without general access to drafts.

STANDARD/HIGH/ULTRA generation uses 1/2/3 article units and the site's shared AI capacity. The request is refused with `402` when available article units do not cover it and every request still waiting, and with `429` when 5 requests are already queued or running. Provider work pauses when shared capacity is exhausted; there is no automatic overage charge.

## Retrying safely

Send an `Idempotency-Key` header (any unique value per request) with writes; it is required for generation. If a request times out, repeat it with the same key and body. Completed responses replay for 24 hours with `Idempotent-Replayed: true`. Running requests or uncertain outcomes return `409` and retain their claim rather than running twice. Do not use a new key to bypass this state: inspect the result or contact support for reconciliation. Known client rejections, including insufficient article units (`402`), allow the same request to retry after correction or funding. The same unexpired key with a different body returns `422`.
