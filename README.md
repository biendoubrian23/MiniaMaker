# Thumbnail Generator

Application web Next.js pour générer des miniatures créatives avec l'intelligence artificielle Gemini.

## 🎯 Fonctionnalités

- **Upload de 3 images** : Visage, inspiration, et image extra (objet/outil)
- **Prompt personnalisé** : Décrivez précisément la miniature souhaitée
- **Génération IA** : Utilise Gemini 3 Pro Image Preview
- **Choix du nombre** : Générez 1 à 4 miniatures
- **Téléchargement** : Téléchargez vos créations
- **UI minimaliste** : Design épuré, fond blanc, angles droits

## 🚀 Installation

### Prérequis

- Node.js 18+ installé
- npm ou yarn
- Clé API Gemini (déjà configurée dans `.env.local`)

### Étapes d'installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Vérifier la configuration** :
La clé API Gemini est déjà configurée dans `.env.local` :
```
GEMINI_API_KEY=AIzaSyDPD1n7k824uF4-DBBHt-Gtne-d9YiWSWQ
```

3. **Lancer le serveur de développement** :
```bash
npm run dev
```

4. **Ouvrir l'application** :
Accédez à [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
MiniaMaker/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API de génération
│   ├── globals.css               # Styles globaux
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── components/
│   ├── Button.tsx                # Composant bouton
│   ├── GeneratedGrid.tsx         # Grille d'images générées
│   ├── Header.tsx                # En-tête
│   ├── PromptBox.tsx            # Zone de prompt
│   └── UploadBox.tsx            # Zone d'upload
├── lib/
│   ├── ai.ts                     # Intégration Gemini
│   └── validate.ts               # Validation des fichiers
├── types/
│   └── index.ts                  # Types TypeScript
├── .env.local                    # Variables d'environnement
├── next.config.js               # Configuration Next.js
├── package.json                 # Dépendances
├── tailwind.config.ts           # Configuration Tailwind
└── tsconfig.json                # Configuration TypeScript
```

## 🎨 Guide d'utilisation

1. **Uploadez vos images** :
   - **Face Image** : Photo de visage à intégrer
   - **Inspiration Image** : Style/ambiance de référence
   - **Extra Image** : Objet, outil ou symbole additionnel

2. **Décrivez votre miniature** :
   - Saisissez un prompt de minimum 10 caractères
   - Soyez précis sur ce que vous souhaitez voir

3. **Choisissez le nombre** :
   - Sélectionnez entre 1 et 4 miniatures à générer

4. **Générez** :
   - Cliquez sur "Générer les miniatures"
   - Attendez la génération (peut prendre quelques secondes)

5. **Téléchargez** :
   - Survolez une miniature et cliquez sur "Télécharger"

## 🛠️ Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utilitaire
- **Gemini AI** : Modèle `gemini-3-pro-image-preview`
- **React** : Bibliothèque UI

## 📝 Configuration

### Variables d'environnement

Fichier `.env.local` :
```
GEMINI_API_KEY=votre_clé_api
```

### Modèle IA utilisé

Le projet utilise **gemini-3-pro-image-preview** comme spécifié dans le cahier des charges.

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm run start

# Linter
npm run lint
```

## ⚠️ Notes importantes

- **Taille des fichiers** : Maximum 10 Mo par image
- **Formats acceptés** : PNG, JPG, JPEG, WEBP
- **Prompt** : Minimum 10 caractères, maximum 2000
- **Génération** : 1 à 4 images par requête

## 🎯 Roadmap (fonctionnalités futures)

- [ ] Génération vidéo
- [ ] Sauvegarde dans un compte utilisateur
- [ ] Historique des prompts
- [ ] Mode "template" YouTube

## 📄 Licence

Ce projet est privé et destiné à BiendouCorp.

## 👨‍💻 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2025
