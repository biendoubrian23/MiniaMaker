// Utilitaires pour Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client Supabase avec la clé service pour contourner RLS côté serveur
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload une image vers Supabase Storage
 * @param userId - ID de l'utilisateur
 * @param imageBuffer - Buffer de l'image
 * @param imageIndex - Index de l'image dans la série de générations
 * @returns URL publique de l'image uploadée
 */
export async function uploadImageToStorage(
  userId: string,
  imageBuffer: Buffer,
  imageIndex: number = 0
): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${userId}/generation-${timestamp}-${imageIndex}.png`;

  const { data, error } = await supabaseAdmin.storage
    .from('generations')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Erreur upload Supabase Storage:', error);
    throw new Error(`Échec upload image: ${error.message}`);
  }

  // Récupérer l'URL publique
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('generations')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * Enregistre une génération dans la base de données
 * @param userId - ID de l'utilisateur
 * @param prompt - Prompt utilisé
 * @param imageUrl - URL de l'image stockée
 * @param creditsUsed - Nombre de crédits utilisés
 */
export async function saveGeneration(
  userId: string,
  prompt: string,
  imageUrl: string,
  creditsUsed: number
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('generations')
    .insert({
      user_id: userId,
      prompt: prompt,
      image_url: imageUrl,
      count: 1,
      credits_used: creditsUsed
    });

  if (error) {
    console.error('Erreur enregistrement génération:', error);
    throw new Error(`Échec enregistrement: ${error.message}`);
  }
}

/**
 * Supprime une génération (image + entrée DB)
 * @param generationId - ID de la génération à supprimer
 * @param imageUrl - URL de l'image à supprimer du storage
 */
export async function deleteGeneration(
  generationId: string,
  imageUrl: string
): Promise<void> {
  // Extraire le chemin du fichier depuis l'URL
  const urlParts = imageUrl.split('/generations/');
  if (urlParts.length === 2) {
    const filePath = urlParts[1].split('?')[0]; // Enlever les query params
    
    // Supprimer du storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('generations')
      .remove([filePath]);

    if (storageError) {
      console.error('Erreur suppression storage:', storageError);
      // Continue quand même pour supprimer de la DB
    }
  }

  // Supprimer de la base de données
  const { error: dbError } = await supabaseAdmin
    .from('generations')
    .delete()
    .eq('id', generationId);

  if (dbError) {
    console.error('Erreur suppression DB:', dbError);
    throw new Error(`Échec suppression: ${dbError.message}`);
  }
}

/**
 * Déduit des crédits du compte utilisateur
 * @param userId - ID de l'utilisateur
 * @param amount - Nombre de crédits à déduire
 */
export async function deductCredits(
  userId: string,
  amount: number
): Promise<void> {
  // D'abord récupérer les crédits actuels
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    console.error('Erreur récupération profil:', fetchError);
    throw new Error(`Échec récupération profil: ${fetchError?.message}`);
  }

  // Déduire les crédits
  const newCredits = Math.max(0, profile.credits - amount);
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ credits: newCredits })
    .eq('id', userId);

  if (updateError) {
    console.error('Erreur déduction crédits:', updateError);
    throw new Error(`Échec déduction crédits: ${updateError.message}`);
  }

  // Enregistrer la transaction
  const { error: transactionError } = await supabaseAdmin
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'generation',
      description: `Génération de miniature`
    });

  if (transactionError) {
    console.error('Erreur enregistrement transaction:', transactionError);
    // Ne pas bloquer si la transaction échoue, juste logger
  }
}

/**
 * Récupère toutes les générations d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Liste des générations
 */
export async function getUserGenerations(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur récupération générations:', error);
    throw new Error(`Échec récupération: ${error.message}`);
  }

  return data;
}
