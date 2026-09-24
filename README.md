# Jaloré — boutique en ligne

Site conçu & développé par **ETIC TECHNOLOGIES**.

Site statique (HTML / CSS / JS, sans build) : `index.html`, `styles.css`, `app.js`, `assets/img/`.

## Avant la mise en ligne

1. Dans `app.js`, renseigner le numéro WhatsApp de la boutique :
   ```js
   const CONFIG = { whatsapp: "221771234567", currency: "FCFA" };
   ```
   (format international, sans `+` ni espaces). Les commandes arrivent sur ce numéro sous forme de message récapitulatif.
2. Prix : modifiables dans `PRICES` (`app.js`). Produits : tableau `PRODUCTS`.

## Hébergement

Déposer le dossier tel quel sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, cPanel…).
Le site fonctionne aussi en ouvrant `index.html` directement.
