// API route pour décrémenter les crédits après génération
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth.server';

// Client admin pour contourner RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // ✅ SÉCURITÉ: Authentification côté serveur
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    const { count } = await request.json();

    if (!count || count < 1) {
      return NextResponse.json(
        { error: 'count est requis et doit être positif' },
        { status: 400 }
      );
    }

    // Récupérer le profil actuel
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a assez de crédits
    if (profile.credits < count) {
      return NextResponse.json(
        { error: 'Crédits insuffisants' },
        { status: 403 }
      );
    }

    // Décrémenter les crédits
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - count })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Enregistrer la transaction
    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -count,
        type: 'generation',
        description: `Génération de ${count} miniature(s)`,
      });

    return NextResponse.json({ success: true, newCredits: profile.credits - count });

  } catch (error) {
    console.error('Error decrementing credits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des crédits' },
      { status: 500 }
    );
  }
}
