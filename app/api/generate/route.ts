// API Route pour la génération de miniatures
import { NextRequest, NextResponse } from 'next/server';
import { generateThumbnails } from '@/lib/ai';
import { uploadImageToStorage, saveGeneration, deductCredits } from '@/lib/storage';
import { getAuthenticatedUser } from '@/lib/auth.server';
import type { GenerateRequest, GenerateResponse, ErrorResponse } from '@/types';

// Simple rate limiting en mémoire (reset au redémarrage serveur)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 générations
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // par heure

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Sanitize le prompt pour éviter les injections
function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
    .replace(/[<>]/g, '') // Supprimer les caractères < et >
    .trim()
    .slice(0, 2000); // Limiter la longueur
}

export async function POST(request: NextRequest) {
  try {
    // ✅ SÉCURITÉ: Authentification côté serveur
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Non authentifié - veuillez vous reconnecter' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // ✅ SÉCURITÉ: Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Trop de requêtes. Veuillez réessayer dans une heure.' },
        { status: 429 }
      );
    }

    const body: GenerateRequest = await request.json();
    
    console.log('Request received for generation:', {
        prompt: body.prompt?.slice(0, 50),
        count: body.count,
        hasFace: !!body.faceImageUrl,
        hasInspiration: !!body.inspirationImageUrl,
        hasExtra: !!body.extraImageUrl,
        userId: userId
    });

    // Validation des champs requis
    if (!body.faceImageUrl) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Image de visage manquante' },
        { status: 400 }
      );
    }

    if (!body.inspirationImageUrl) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Image d\'inspiration manquante' },
        { status: 400 }
      );
    }

    // Image extra est optionnelle - pas de validation requise

    // ✅ SÉCURITÉ: Sanitization du prompt
    const sanitizedPrompt = sanitizePrompt(body.prompt || '');
    if (sanitizedPrompt.length < 10) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Le prompt doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    let count = body.count || 2;
    if (count < 1 || count > 4) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Le nombre d\'images doit être entre 1 et 4' },
        { status: 400 }
      );
    }

    // Vérifier les crédits disponibles et ajuster le nombre d'images si nécessaire
    const creditsPerImage = 1;
    let userCredits = 0;
    
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();
      
      userCredits = profile?.credits || 0;
    } catch (err) {
      console.warn('Impossible de vérifier les crédits:', err);
    }

    // Ajuster le nombre d'images au nombre de crédits disponibles
    if (userCredits > 0 && userCredits < count) {
      console.log(`⚠️ User a ${userCredits} crédits, demande ${count} images → génère ${userCredits} images`);
      count = userCredits;
    } else if (userCredits === 0) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Vous n\'avez plus de crédits. Achetez des crédits pour continuer.' },
        { status: 402 }
      );
    }

    // Appel à l'IA pour générer les miniatures (OPTIMISÉ)
    const images = await generateThumbnails(
      body.faceImageUrl,
      body.inspirationImageUrl,
      body.extraImageUrl,
      sanitizedPrompt,
      count
    );

    // Coût par image
    const totalCredits = count * creditsPerImage;

    // Essayer d'uploader et stocker, mais ne pas bloquer si ça échoue
    let uploadedImages: string[] = [];
    let storageSuccess = false;
    
    try {
      for (let i = 0; i < images.length; i++) {
        const base64Image = images[i];
        
        // Convertir base64 en Buffer
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Upload vers Supabase Storage
        const imageUrl = await uploadImageToStorage(userId, imageBuffer, i);
        uploadedImages.push(imageUrl);

        // Enregistrer dans la table generations
        await saveGeneration(userId, sanitizedPrompt, imageUrl, creditsPerImage);
      }

      // Déduire les crédits de l'utilisateur
      await deductCredits(userId, totalCredits);
      storageSuccess = true;

      console.log(`✅ ${images.length} images uploadées et ${totalCredits} crédits déduits pour user ${userId}`);
      
    } catch (storageError) {
      // Le stockage a échoué (espace plein, erreur réseau, etc.)
      // On continue quand même avec les images base64
      console.warn('⚠️ Stockage échoué, fallback sur images base64:', storageError);
      uploadedImages = []; // Reset pour utiliser les images base64
    }

    // Retourner les images (URLs si stockage réussi, sinon base64)
    const finalImages = storageSuccess && uploadedImages.length > 0 ? uploadedImages : images;
    const response: GenerateResponse = { images: finalImages };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json<ErrorResponse>(
      { 
        error: 'Échec de la génération des miniatures',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour vérifier que l'API est accessible
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      message: 'API de génération de miniatures',
      version: '1.0.0'
    },
    { status: 200 }
  );
}
