# Audit performance — JK Prod

Date : 12 novembre 2026
URL auditée : https://jkprod01.github.io/

## Résultat principal

Le build public embarquait un runtime Manus de développement d’environ 369 Ko directement dans `index.html`. Le HTML initial faisait environ 372 Ko, dont 369 Ko de scripts inline. Ce runtime n’est pas nécessaire pour GitHub Pages.

Le plugin Manus est désormais chargé uniquement pendant `vite serve` (aperçu local). Il est exclu du build de production `vite build`.

### Gain mesuré

| Ressource | Avant | Après | Gain |
|---|---:|---:|---:|
| `index.html` brut | ~371,9 Ko | ~5,0 Ko | ~367 Ko |
| `index.html` gzip | ~107,2 Ko | ~1,5 Ko | ~105,7 Ko |
| JavaScript gzip | ~81,4 Ko | ~81,4 Ko | inchangé |
| CSS gzip | ~21,6 Ko | ~21,6 Ko | inchangé |

Le gain est particulièrement important sur mobile et sur les connexions lentes : le navigateur reçoit beaucoup moins de HTML avant de commencer à charger l’application.

## Constats

- Les vidéos ne sont pas téléchargées au chargement initial : les lecteurs sont dans des fenêtres modales et utilisent `preload="metadata"`. C’est une bonne décision.
- Les vidéos restent toutefois lourdes pour une lecture directe : environ 8 à 69 Mo par fichier. La lecture progressive est possible grâce à `Accept-Ranges`, mais une connexion mobile peut attendre avant de démarrer.
- Les réponses GitHub Pages sont servies avec gzip pour HTML, JavaScript et CSS.
- Les ressources statiques sont correctement versionnées par Vite pour JavaScript et CSS.
- Le cache public observé est de 10 minutes (`max-age=600`). C’est acceptable pour GitHub Pages, mais moins performant qu’un CDN maîtrisé avec cache long pour les fichiers hashés.
- Les images de projets sont lazy-loadées. Le hero utilise une image en background CSS et les portraits sont réutilisés avec cache navigateur.
- L’API PageSpeed Insights n’a pas fourni de score pendant l’audit, car elle a répondu HTTP 429 (limite temporaire de requêtes). Les mesures locales et HTTP restent exploitables.

## Priorités restantes

### Priorité 1 — déjà appliquée

Exclure le runtime Manus du build public. Aucun changement visuel ou fonctionnel attendu sur le portfolio ; le runtime reste disponible dans l’aperçu local.

### Priorité 2 — recommandée pour les futures vidéos

Conserver une version web de chaque vidéo entre 720p et 1080p, idéalement avec un débit raisonnable et le paramètre `faststart` de MP4. Pour les vidéos très lourdes, héberger la version de lecture sur YouTube ou Vimeo et garder seulement une miniature locale permettrait de réduire le coût de bande passante GitHub Pages.

### Priorité 3 — optionnelle

Ajouter une vraie miniature dédiée pour chaque nouvelle vidéo et éviter d’utiliser une vidéo comme ressource initiale. Le portfolio actuel utilise déjà des posters pour le showreel et les fiches projet.

### Priorité 4 — optionnelle

Ajouter `decoding="async"` aux images non critiques et `loading="lazy"` aux portraits situés sous la ligne de flottaison. Le gain sera secondaire par rapport à la suppression du runtime inline.

## Conclusion

Le problème technique le plus important a été identifié et corrigé : le HTML initial est passé d’environ 372 Ko à 5 Ko. Le site reste visuellement riche, mais la première réponse est maintenant beaucoup plus légère. La prochaine optimisation réellement significative concernera uniquement la stratégie d’hébergement des vidéos, pas le code React.
