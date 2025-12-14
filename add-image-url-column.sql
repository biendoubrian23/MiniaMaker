-- Ajouter la colonne image_url à la table generations
ALTER TABLE public.generations 
ADD COLUMN IF NOT EXISTS image_url TEXT;
