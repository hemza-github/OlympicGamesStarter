# OlympicGamesStarter

# 🏅 OlympicGamesStarter - Application Web Interactive pour les Jeux Olympiques

Bienvenue dans le dépôt de l'application **OlympicGamesStarter**, développée par l'équipe de DelivWeb pour anticiper les prochains Jeux Olympiques. Cette application web interactive permet aux utilisateurs de découvrir les statistiques des participations olympiques par pays, de consulter les détails des éditions précédentes et d'explorer l'évolution des performances sportives à travers les années.

## 🚀 Objectifs du Projet

- Présenter de manière interactive les participations olympiques.
- Permettre à l'utilisateur de naviguer par pays et par édition.
- Mettre en avant les statistiques clés liées aux médailles et disciplines.
- Offrir une UX moderne, fluide et responsive.

---

## 🛠️ Stack Technique

- **Framework Frontend** : [Angular 17](https://angular.io/)
- **Langage** : TypeScript
- **Stylisation** : SCSS DaisyUI 
- **Routing** : Angular Router
- **Mock API** : JSON local (assets/mock/olympic.json)

---

## 🗂️ Structure du Projet

```bash
├── app                                   # Dossier principal de l'application Angular
│   ├── app.component.html                # Template HTML du composant racine
│   ├── app.component.scss                # Style SCSS du composant racine
│   ├── app.component.spec.ts             # Fichier de test unitaire du composant racine
│   ├── app.component.ts                  # Logique du composant racine
│   ├── app.module.ts                     # Module principal de l'application
│   ├── app-routing.module.ts             # Configuration du système de routage
│   ├── core                              # Dossier des ressources fondamentales (services, modèles)
│   │   ├── models                        # Définitions des interfaces et modèles de données
│   │   │   ├── Olympic.ts                # Modèle représentant un événement olympique
│   │   │   ├── Participation.ts          # Modèle représentant une participation par pays
│   │   │   └── Statistics.ts             # Modèle pour les statistiques liées aux Jeux
│   │   └── services                      # Services pour l'accès aux données et la logique métier
│   │       ├── olympic.service.spec.ts   # Test unitaire du service olympique
│   │       └── olympic.service.ts        # Service principal pour les données olympiques
│   └── pages                             # Pages principales de l'application
│       ├── detail                        # Page de détail d'un pays
│       │   ├── detail.component.html     # Template HTML de la page détail
│       │   ├── detail.component.scss     # Style SCSS de la page détail
│       │   ├── detail.component.spec.ts  # Tests unitaires de la page détail
│       │   └── detail.component.ts       # Logique TypeScript de la page détail
│       ├── home                          # Page d'accueil
│       │   ├── home.component.html       # Template HTML de la page d'accueil
│       │   ├── home.component.scss       # Style SCSS de la page d'accueil
│       │   ├── home.component.spec.ts    # Tests unitaires de la page d'accueil
│       │   └── home.component.ts         # Logique TypeScript de la page d'accueil
│       └── not-found                     # Page affichée pour les routes non valides
│           ├── not-found.component.html  # Template HTML de la page 404
│           ├── not-found.component.scss  # Style SCSS de la page 404
│           ├── not-found.component.spec.ts # Tests de la page 404
│           └── not-found.component.ts    # Logique de la page 404
├── assets                                # Ressources statiques
│   └── mock
│       └── olympic.json                  # Données mockées pour simuler une API
├── environments                          # Fichiers de configuration pour différents environnements
│   ├── environment.prod.ts               # Configuration pour la production
│   └── environment.ts                    # Configuration pour le développement
├── favicon.ico                           # Icône de l'application
├── index.html                            # Point d'entrée HTML de l'application
├── main.ts                               # Point d'amorçage de l'application Angular
├── polyfills.ts                          # Scripts pour compatibilité navigateur
├── styles.scss                           # Feuille de styles globale de l'application
└── test.ts                               # Configuration globale des tests
```

---

## 📦 Installation & Démarrage

### Prérequis

- Node.js ≥ 18
- Angular CLI ≥ 17

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/hemza-github/OlympicGamesStarter.git
cd OlympicGamesStarter

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
ng serve
```

L'application sera accessible via `http://localhost:4200`.

---

## 🧪 Tests Unitaires

Les tests unitaires sont disponibles pour les composants et services clés :

```bash
ng test
```

---

## 📁 Données Mockées

Les données sont stockées localement dans le fichier `assets/mock/olympic.json`. Le service `OlympicService` simule des appels API REST pour exploiter ces données via `HttpClient`.

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de respecter la structure actuelle et de soumettre vos Pull Requests en suivant la convention [Conventional Commits](https://www.conventionalcommits.org/).

---

## 👩‍💼 À propos

Développé par l'équipe de DelivWeb pour **OlympicGamesStarter**, dans le cadre des préparatifs des Jeux Olympiques.

Responsable projet : Jeanette  
Développeur principal : Hemza

---
