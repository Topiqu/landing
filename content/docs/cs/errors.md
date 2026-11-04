---
title: Chyby a kompatibilita
description: Zpracování chyb, upgradů a zpětně kompatibilních rozšíření.
order: 4
sitemap:
  loc: /cs/docs/errors
  changefreq: monthly
---

# Chyby a kompatibilita

Jako hlavní signál používejte HTTP status. Textovou zprávu berte pouze jako diagnostickou informaci.

| Status | Význam                                                                               |
| ------ | ------------------------------------------------------------------------------------ |
| `400`  | Neplatný požadavek nebo parametr                                                     |
| `401`  | Chybějící nebo neplatný API klíč                                                     |
| `402`  | Na generování nestačí kredity na články                                              |
| `403`  | Klíči nebo členovi, za kterého jedná, chybí potřebné oprávnění                       |
| `404`  | Článek nebo generování pro tento web neexistuje, nebo ho klíč nesmí číst             |
| `409`  | Konflikt úprav, práva k médiím k potvrzení, nebo stejný `Idempotency-Key` ještě běží |
| `422`  | `Idempotency-Key` už byl použit pro jiný požadavek                                   |
| `429`  | Příliš mnoho požadavků nebo čekajících generování                                    |
| `500`  | Neočekávaná chyba serveru                                                            |

Některé chyby nesou podrobnosti v `data`, například `data.code` (`ARTICLE_EDIT_CONFLICT`, `MEDIA_RIGHTS_REVIEW_REQUIRED`) nebo kredity `required` a `available` u `402`.

## Pravidla verzování

API v1 může získat nové endpointy, volitelné parametry a volitelná pole odpovědí. Klienti musí ignorovat pole, která neznají. Odstranění či přejmenování pole, změna jeho typu nebo přidání povinného parametru vyžaduje novou hlavní verzi API.

Ukončované chování oznámíme v changelogu před jeho odstraněním.
