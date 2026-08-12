---
title: Autentizace
description: Bezpečné přihlášení pomocí API klíče webu v Topiqu.
order: 2
---

# Autentizace

Každý požadavek vyžaduje API klíč webu, jehož články chcete získat.

```http
x-api-key: YOUR_API_KEY
```

## Klíče patří na server

S klíčem zacházejte jako s heslem. Nikdy jej necommitujte, nevkládejte do veřejného JavaScriptu, URL ani aplikačních logů. Požadavky by měly běžně odcházet z vašeho serveru.

Použijte proměnnou prostředí:

```bash
TOPIQU_API_KEY=vas-klic
```

Chybějící nebo neplatný klíč vrací `401 Unauthorized`. Pokud mohl uniknout, ihned jej rotujte; předchozí klíč pak přestane fungovat.
