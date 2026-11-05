---
title: 'API klíče s oprávněními, zápis článků a generování'
description: 'Externí API teď umí vytvářet a upravovat články, zařadit generování AI a dát vědět webhookem. Každý klíč má jen oprávnění, která integrace potřebuje.'
date: 2026-11-04
version: '2026.11.04'
type: new
areas:
  - api
  - integrations
breaking: false
featured: true
sitemap:
  loc: /cs/changelog/2026-11-04-api-keys-writes-and-generation
  changefreq: yearly
---

# API klíče s oprávněními, zápis článků a generování

Externí API už neslouží jen ke čtení publikovaných článků. Integrace teď mohou obsah zapisovat i generovat a každý klíč dostane jen potřebný přístup.

## API klíče

- V nastavení vytvoříte až 10 pojmenovaných klíčů na blog, uvidíte jejich poslední použití a kterýkoli můžete zneplatnit.
- U každého klíče zvolíte oprávnění `READ`, `WRITE`, `PUBLISH` a `GENERATE`. Klíč nikdy nepřekročí oprávnění člena, který ho vytvořil.
- Klíče ukládáme jen jako otisk a zobrazíme je jednou, takže si nový klíč při vytvoření zkopírujte.
- Každý klíč má limit 120 požadavků za minutu.

## Zápis článků

- `POST /api/v1/articles` článek vytvoří a `PATCH /api/v1/articles/:id` ho upraví. Publikování, jeho zrušení a plánování vyžaduje oprávnění `PUBLISH`.
- `GET /api/v1/articles/:id` vrací klíčům s oprávněním `WRITE` i koncepty.
- S hlavičkou `Idempotency-Key` můžete požadavek bezpečně opakovat: uloženou odpověď vracíme 24 hodin.

## Generování článků

- `POST /api/v1/articles/generate` zařadí zadané téma do fronty a výsledkem je koncept. Tento endpoint vyžaduje hlavičku `Idempotency-Key`.
- `GET /api/v1/generations/:id` vrací stav generování.
- Nové webhooky `generation.succeeded` a `generation.failed` vám dají vědět o dokončení.

Stávající klíče fungují dál s přístupem jen pro čtení, takže nemusíte nic migrovat. Pro nové endpointy si vytvořte nový klíč s potřebnými oprávněními.
