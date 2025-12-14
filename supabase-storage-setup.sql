-- Instructions SQL pour configurer Supabase Storage pour MiniaMaker
-- À exécuter dans l'éditeur SQL de Supabase APRÈS avoir créé le bucket

-- ÉTAPE 1 : Créer le bucket via l'interface Supabase
-- Aller dans Storage > Create bucket
-- Nom : "generations"
-- Public : OUI (pour permettre l'accès aux URLs)

-- ÉTAPE 2 : Exécuter ce SQL pour configurer les policies

-- Policy pour permettre aux utilisateurs authentifiés d'uploader dans leur dossier
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'generations' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy pour permettre aux utilisateurs de voir leurs propres images
CREATE POLICY "Users can view their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'generations'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy pour permettre aux utilisateurs de supprimer leurs propres images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'generations'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy pour permettre l'accès public en lecture (car bucket est public)
CREATE POLICY "Public can view all images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'generations');

-- ÉTAPE 3 : Mettre à jour la table generations si elle existe déjà
-- Ajouter la colonne image_url si elle n'existe pas encore
ALTER TABLE public.generations 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Rendre la colonne obligatoire pour les nouvelles entrées
-- (Vous pouvez décommenter cette ligne après avoir migré les anciennes données)
-- ALTER TABLE public.generations ALTER COLUMN image_url SET NOT NULL;
