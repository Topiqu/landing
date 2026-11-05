---
title: Scoped API keys, article writes and generation
description: The External API can now create and edit articles, queue AI generation and notify you by webhook, with keys limited to what each integration needs.
date: 2026-11-04
version: '2026.11.04'
type: new
areas:
  - api
  - integrations
breaking: false
featured: true
sitemap:
  loc: /en/changelog/2026-11-04-api-keys-writes-and-generation
  changefreq: yearly
---

# Scoped API keys, article writes and generation

The External API now does more than read published articles. Integrations can write and generate content, and each key gets only the access it needs.

## API keys

- Create up to 10 named keys per blog in settings, see when each was last used and revoke any of them.
- Choose the `READ`, `WRITE`, `PUBLISH` and `GENERATE` scopes for each key. A key never exceeds the permissions of the member who created it.
- Keys are stored only as hashes and shown once, so copy a new key when you create it.
- Each key is limited to 120 requests per minute.

## Writing articles

- `POST /api/v1/articles` creates an article and `PATCH /api/v1/articles/:id` updates one. Publishing, unpublishing and scheduling require the `PUBLISH` scope.
- `GET /api/v1/articles/:id` returns drafts to keys with the `WRITE` scope.
- Send an `Idempotency-Key` header to retry safely: the stored response is replayed for 24 hours.

## Generating articles

- `POST /api/v1/articles/generate` queues a requested topic, which is written as a draft. This endpoint requires the `Idempotency-Key` header.
- `GET /api/v1/generations/:id` reports its status.
- The new `generation.succeeded` and `generation.failed` webhooks tell you when it finishes.

Existing keys keep working with read-only access, so no migration is required. Create a new key with the scopes you need to use the new endpoints.
