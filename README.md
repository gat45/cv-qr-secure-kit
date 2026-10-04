# Kit CV + QR code + documents chiffrés

1. Copiez `config.example.json` vers `config.json` puis renseignez vos coordonnées, votre lien Google Docs, vos profils GitHub et l’URL du site qui doit être encodée dans le QR code.
2. Lancez `npm install`, puis `npm run build` : la page `index.html` et `assets/cv-qr.png` sont créés.
3. Placez permis, diplômes et justificatifs dans `private-source/`, puis lancez `npm run encrypt`. Le script demande le code localement et produit uniquement des fichiers chiffrés dans `vault/`. Vous pouvez les vérifier avec `npm run verify`.
4. Publiez le dépôt avec GitHub Pages. Ne publiez jamais `config.json` si vous ne souhaitez pas afficher vos coordonnées dans le code source, et ne publiez jamais les originaux.

Le coffre utilise AES-256-GCM avec dérivation PBKDF2. Le mot de passe ne figure ni dans le dépôt ni dans le site.
