---
title: Autentizace
description: Bezpečné přihlášení API klíčem Topiqu a volba jeho oprávnění.
order: 2
sitemap:
  loc: /cs/docs/authentication
  changefreq: monthly
---

# Autentizace

Každý požadavek vyžaduje API klíč webu, se kterým pracujete.

```http
x-api-key: YOUR_API_KEY
```

Klíče vytvoříte v nastavení Topiqu v části **Integrace → Přístup k API**. Každé integraci dejte vlastní klíč, abyste mohli jeden zneplatnit bez dopadu na ostatní.

## Oprávnění

Každý klíč má oprávnění (scopes). Číst umí každý klíč, ostatní zapínáte při vytvoření.

| Oprávnění  | Umožňuje                                                    |
| ---------- | ----------------------------------------------------------- |
| `READ`     | Publikované články, štítky a údaje o webu                   |
| `WRITE`    | Vytváření a úpravy konceptů a čtení konceptů                |
| `PUBLISH`  | Publikování, stažení a plánování článků                     |
| `GENERATE` | Zadání článku, který Topiqu napíše; čerpá kredity na články |

`WRITE`, `PUBLISH` a `GENERATE` vyžadují tarif Pro. Klíč jedná za člena týmu, který ho vytvořil: články, které vytvoří, mají tohoto člena jako autora, a nikdy neudělá víc, než smí on. Když člen oprávnění ztratí nebo z webu odejde, ztratí ho i klíč.

## Klíče patří na server

Klíč se zobrazí jen jednou, při vytvoření. Topiqu si ukládá pouze jeho otisk a znovu ho zobrazit nemůže. Když ho ztratíte, vytvořte nový a starý zneplatněte.

S klíčem zacházejte jako s heslem. Nikdy jej necommitujte, nevkládejte do veřejného JavaScriptu, URL ani aplikačních logů. Požadavky by měly běžně odcházet z vašeho serveru.

Použijte proměnnou prostředí:

```bash
TOPIQU_API_KEY=vas-klic
```

Chybějící nebo neplatný klíč vrací `401 Unauthorized`, klíč bez oprávnění, které endpoint potřebuje, vrací `403 Forbidden`. Pokud klíč mohl uniknout, ihned ho zneplatněte; přestane fungovat okamžitě.

## Limity požadavků

Každý klíč smí poslat 120 požadavků za minutu. Nad tento limit API vrací `429 Too Many Requests` s hlavičkou `Retry-After`.
