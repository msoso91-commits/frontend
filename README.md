# Frontend — Analyseur de page arabe

## Installation en local
```bash
npm install
cp .env.example .env    # renseigne VITE_API_URL avec l'URL de ton backend déployé
npm run dev
```

## Déploiement (Vercel, gratuit pour démarrer)
1. Pousse ce dossier sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), importe le dépôt.
3. Dans les paramètres du projet Vercel, ajoute la variable d'environnement `VITE_API_URL` avec l'URL de ton backend.
4. Déploie — Vercel te donne un lien public (ex: `ton-app.vercel.app`), avec possibilité d'y attacher ton propre nom de domaine ensuite.

## Activer la publicité (Google AdSense)
1. Crée un compte sur [adsense.google.com](https://adsense.google.com) avec le domaine de ton app une fois déployée.
2. Google doit **approuver ton site** avant d'afficher de vraies publicités (ça peut prendre plusieurs jours, et nécessite un minimum de contenu réel).
3. Une fois approuvé, remplace le commentaire dans `index.html` par le script fourni par Google (avec ton identifiant `ca-pub-XXXXXXXXXX`).
4. Remplace chaque composant `<AdSlot />` dans `App.jsx` par le bloc `<ins class="adsbygoogle">` fourni par Google pour chaque emplacement.

## Ce qui reste à ta charge avant l'ouverture au public
- Créer les comptes Railway/Render (backend) et Vercel (frontend), et renseigner tes moyens de paiement si besoin (les plans gratuits suffisent pour démarrer).
- Créer et valider ton compte Google AdSense.
- Rédiger une politique de confidentialité (obligatoire avec des comptes utilisateurs + Google Ads exige d'en afficher une).
- Choisir et acheter un nom de domaine si tu ne veux pas rester sur `vercel.app` / `up.railway.app`.
