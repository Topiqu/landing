---
title: Errors & compatibility
description: Handle API failures, upgrades, and backwards-compatible additions.
order: 4
---

# Errors & compatibility

Use the HTTP status code as the primary signal and treat the human-readable message as diagnostic text.

| Status | Meaning |
| --- | --- |
| `400` | Invalid request or parameter |
| `401` | Missing or invalid API key |
| `404` | Article does not exist or is not published for this site |
| `429` | Too many requests |
| `500` | Unexpected server error |

## Versioning policy

API v1 can receive new endpoints, optional parameters, and optional response fields. Clients must ignore fields they do not recognize. Removing or renaming fields, changing their types, or adding required request parameters requires a new major API version.

Deprecated behavior will be announced in the changelog before removal.
