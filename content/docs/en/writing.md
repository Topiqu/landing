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

The request is queued and answered with `202` and a `Location` header. Topiqu researches and writes the article like its autopilot does and saves it as a draft for you to review. Follow the result at `GET /api/v1/generations/{id}` or, better, subscribe to the `generation.succeeded` and `generation.failed` webhooks in your settings. A succeeded generation carries the draft's `articleId`; read it with `GET /api/v1/articles/{id}`.

Each generation uses the article credits of one article at your site's quality setting. The request is refused with `402` when your credits do not cover it and every request still waiting, and with `429` when 5 requests are already queued or running.

## Retrying safely

Send an `Idempotency-Key` header (any unique value per request) with writes; it is required for generation. If a request times out, repeat it with the same key and body: within 24 hours you get the original response, marked `Idempotent-Replayed: true`, and nothing runs twice. The same key with a different body returns `422`.
