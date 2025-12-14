// API route pour décrémenter les crédits après génération
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, count } = await request.json();

    if (!userId || !count) {
      return NextResponse.json(
        { error: 'userId et count sont requis' },
        { status: 400 }
      );
    }

    // Récupérer le profil actuel
    const { data: profile, error: profileError } = await supabase
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
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - count })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Enregistrer la transaction
    await supabase
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
