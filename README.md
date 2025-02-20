# Eco Bliss Bath

Eco Bliss Bath est une start-up de 20 personnes, spécialisée dans la vente de produits de beauté écoresponsables dont le produit principal est un savon solide.
La boutique prépare un site de vente en ligne.


## Prérequis

Avant d'installer le projet, assurez-vous d'avoir les logiciels suivants installés sur votre machine :

1. Docker
2. Node.js
3. NPM (installé avec Node.js)


## Installation du projet

1. Téléchargez ou clonez le dépôt à ce [lien](https://github.com/OpenClassrooms-Student-Center/TesteurLogiciel_Automatisez_des_tests_pour_une_boutique_en_ligne)
2. Ouvrez le dossier du projet dans votre éditeur de code
3. Ouvrez un terminal dans le dossier du projet 
4. Lancez la commande suivante pour démarrer le projet avec Docker : 
```bash
sudo docker-compose up --build
```
Nb : ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.


## Lancement du site

Ouvrez le site depuis la page http://localhost:8080


## Accès à la documentation API (Swagger)

Ouvrez le swagger depuis la page http://localhost:8081/api/doc


## Installation de Cypress

1. Ouvrez un terminal dans le dossier du projet 
2. Lancez la commande : 
```bash
npm install cypress --save-dev
```


## Exécution des tests avec Cypress

Pour lancer Cypress en mode interface graphique :
```bash
npx cypress open
```
Pour lancer les tests en mode ligne de commande :
```bash
npx cypress run
```


## Génération du rapport de test

Des screenshots des erreurs sont générées dans le dossier :
```bash
cypress/screenshots
```


## Identifiants

Utilisez les identifiants suivants pour tester l'application :
1. Email : test2@test.fr
2. Mot de passe : testtest


## Arrêt du projet

Pour arrêter le projet, exécutez la commande suivante :
```bash
docker-compose down
```

