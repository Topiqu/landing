---
title: Chyby a kompatibilita
description: Zpracování chyb, upgradů a zpětně kompatibilních rozšíření.
order: 4
---

# Chyby a kompatibilita

Jako hlavní signál používejte HTTP status. Textovou zprávu berte pouze jako diagnostickou informaci.

| Status | Význam |
| --- | --- |
| `400` | Neplatný požadavek nebo parametr |
| `401` | Chybějící nebo neplatný API klíč |
| `404` | Článek neexistuje nebo není pro tento web publikovaný |
| `429` | Příliš mnoho požadavků |
| `500` | Neočekávaná chyba serveru |

## Pravidla verzování

API v1 může získat nové endpointy, volitelné parametry a volitelná pole odpovědí. Klienti musí ignorovat pole, která neznají. Odstranění či přejmenování pole, změna jeho typu nebo přidání povinného parametru vyžaduje novou hlavní verzi API.

Ukončované chování oznámíme v changelogu před jeho odstraněním.
