# Guide d'installation du Stockage d'Images

## Étapes à suivre dans Supabase

### 1. Créer le bucket Storage

1. Allez dans votre dashboard Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet MiniaMaker
3. Dans le menu de gauche, cliquez sur **Storage**
4. Cliquez sur **Create bucket**
5. Configuration du bucket :
   - **Name** : `generations`
   - **Public bucket** : ✅ **OUI** (cochez cette case)
   - Cliquez sur **Create bucket**

### 2. Configurer les RLS Policies

1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu du fichier `supabase-storage-setup.sql`
4. Cliquez sur **Run** pour exécuter le SQL

### 3. Mettre à jour la table generations

Si vous avez déjà créé la table `generations`, exécutez cette commande SQL pour ajouter la colonne manquante :

```sql
ALTER TABLE public.generations 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

OU recréez la table complète avec le nouveau schéma dans `supabase-schema.sql`.

### 4. Ajouter la clé Service Role dans .env

1. Dans Supabase Dashboard, allez dans **Settings** → **API**
2. Copiez la clé **service_role key** (⚠️ GARDEZ-LA SECRÈTE)
3. Ajoutez-la dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS le fichier `.env.local` dans Git !

### 5. Tester le système

1. Redémarrez votre serveur de développement : `npm run dev`
2. Connectez-vous à votre application
3. Allez dans l'espace de génération
4. Générez une miniature
5. Vérifiez que :
   - L'image apparaît dans Storage → generations
   - L'URL est enregistrée dans la table `generations`
   - Les crédits sont déduits correctement
6. Cliquez sur le bouton **STOCKAGE IMAGES** pour voir vos images

## Structure du Stockage

Les images sont organisées ainsi dans le bucket `generations` :

```
generations/
├── {user-id-1}/
│   ├── generation-1234567890-0.png
│   ├── generation-1234567890-1.png
│   └── generation-1234567891-0.png
└── {user-id-2}/
    └── generation-1234567892-0.png
```

Chaque utilisateur a son propre dossier (identifié par son `user_id`).

## Fonctionnalités ajoutées

✅ **Upload automatique** : Chaque image générée est automatiquement uploadée vers Supabase Storage
✅ **Enregistrement BDD** : L'URL et les métadonnées sont sauvegardées dans la table `generations`
✅ **Déduction crédits** : Les crédits sont automatiquement déduits (1 crédit par image)
✅ **Page Stockage** : Nouvelle page `/storage` pour voir toutes les images générées
✅ **Téléchargement** : Bouton pour télécharger chaque image
✅ **Agrandissement** : Modal pour voir les images en grand
✅ **Historique** : Voir le prompt, la date et les crédits utilisés pour chaque génération

## Sécurité

- ✅ Row Level Security (RLS) activé
- ✅ Chaque user ne peut voir que ses propres images
- ✅ Authentification requise pour uploader/voir les images
- ✅ Service Role Key utilisée uniquement côté serveur

## Dépannage

**Erreur "bucket not found"** :
- Vérifiez que le bucket `generations` existe bien dans Storage
- Vérifiez que vous avez coché "Public bucket"

**Images non visibles** :
- Vérifiez les RLS policies dans SQL Editor
- Vérifiez que la clé service_role est bien configurée

**Crédits non déduits** :
- Vérifiez que la table `profiles` existe et contient votre user
- Vérifiez les logs de la console pour voir les erreurs

Pour toute question, vérifiez les logs dans la console du navigateur et dans les logs Supabase.
