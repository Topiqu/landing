---
title: Errors & compatibility
description: Handle API failures, upgrades, and backwards-compatible additions.
order: 4
sitemap:
  loc: /en/docs/errors
  changefreq: monthly
---

# Errors & compatibility

Use the HTTP status code as the primary signal and treat the human-readable message as diagnostic text.

| Status | Meaning                                                                                |
| ------ | -------------------------------------------------------------------------------------- |
| `400`  | Invalid request or parameter                                                           |
| `401`  | Missing or invalid API key                                                             |
| `402`  | Not enough article credits for a generation                                            |
| `403`  | The key, or the member it acts for, lacks the required permission                      |
| `404`  | The article or generation does not exist for this site, or the key cannot read it      |
| `409`  | Edit conflict, media rights to confirm, or the same `Idempotency-Key` is still running |
| `422`  | The `Idempotency-Key` was already used for a different request                         |
| `429`  | Too many requests, or too many generations waiting                                     |
| `500`  | Unexpected server error                                                                |

Some errors carry details in `data`, for example `data.code` (`ARTICLE_EDIT_CONFLICT`, `MEDIA_RIGHTS_REVIEW_REQUIRED`) or the `required` and `available` credits of a `402`.

## Versioning policy

API v1 can receive new endpoints, optional parameters, and optional response fields. Clients must ignore fields they do not recognize. Removing or renaming fields, changing their types, or adding required request parameters requires a new major API version.

Deprecated behavior will be announced in the changelog before removal.
