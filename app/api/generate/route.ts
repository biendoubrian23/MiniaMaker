// API Route pour la génération de miniatures
import { NextRequest, NextResponse } from 'next/server';
import { generateThumbnails } from '@/lib/ai';
import type { GenerateRequest, GenerateResponse, ErrorResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    console.log('Request received for generation:', {
        prompt: body.prompt,
        count: body.count,
        hasFace: !!body.faceImageUrl,
        hasInspiration: !!body.inspirationImageUrl,
        hasExtra: !!body.extraImageUrl
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

    if (!body.extraImageUrl) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Image extra manquante' },
        { status: 400 }
      );
    }

    if (!body.prompt || body.prompt.trim().length < 10) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Le prompt doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    const count = body.count || 2;
    if (count < 1 || count > 4) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Le nombre d\'images doit être entre 1 et 4' },
        { status: 400 }
      );
    }

    // Appel à l'IA pour générer les miniatures (OPTIMISÉ)
    const images = await generateThumbnails(
      body.faceImageUrl,
      body.inspirationImageUrl,
      body.extraImageUrl,
      body.prompt,
      count
    );

    // Retourner les images générées
    const response: GenerateResponse = { images };
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
