# Top Chart Bot (Version Publique)
## Description du projet
Il s'agit d'un bot pour le réseau social X ex Twitter qui poste toutes les 2 heures (depuis le 9/11/2024 avant c'était toutes les heures) la chanson la plus populaire pour un pays aléatoire et une année aléatoire, le post contient aussi le lien YouTube qui mène vers la chanson. Depuis le 26/11/2024, le bot est présent aussi sur BlueSky !
Ce repo contient la version publique du bot, i.e. les clées API utilisées dans le fichier .env sont cachées. 
### Liens des comptes 
- [Voici le lien du compte sur X](https://x.com/Top1Chart_Bot) 

- [Voici le lien du compte sur BlueSky](https://bsky.app/profile/top1chartbot.bsky.social)
***
## Technologies utilisées
Le bot est codé entièrement en JavaScript, et est conteneurisé dans un container Docker. Le fichier index.js contient le code pour faire fonctionner le bot et le fichier package.json contient toutes les dépendances pour faire fonctionner le projet.
Le Dockerfile est écrit de telle sorte pour déployer le bot sur une machine virtuelle gratuite de [Render](https://render.com/) . Le bot utilise les API de X, de BlueSky (atproto API) et celle de Google (pour le lien YouTube), il récupère la donnée à poster sur https://www.thisdayinmusic.com/birthday-no1/ (USA 🇺🇸, UK 🇬🇧, Allemagne 🇩🇪, Australie 🇦🇺, Canada 🇨🇦), https://www.chartsinfrance.net/charts/ (France 🇫🇷) et https://kma.kkbox.com (Japon 🇯🇵) en scrappant avec Puppeteer. Un cronjob permet l'exécution de la fonction principale toutes les 2 heures (à chaque fois que le chiffre des minutes est égal à 0 toutes les 2 heures). 
***
## Déploiment du bot
* Créer un repo GitHub à partir de celui-ci 
* Mettre les clés API correspondantes dans le fichier .env
* Créer un Web Service sur [Render](https://render.com/) et le lier à votre repo.
* Rajouter dans "Advanced" les variables suivantes ```PUPPETEER_SKIP_CHROMIUM_DONWLOAD=true``` et ```PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable```
* Créer le service et tout est prêt

***



