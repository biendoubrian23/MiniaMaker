import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

// Supabase avec service role (pour bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configuration des packs - PRODUCTION
const PACKS = {
  'price_1Sg1IfAD8RQLLuu15Jkwp4UJ': { name: 'starter', credits: 10, amount: 499 },
  'price_1Sg1JAAD8RQLLuu1ie8SYSAc': { name: 'pro', credits: 25, amount: 999 },
} as const;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ Webhook: Pas de signature Stripe');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook signature invalide:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('📩 Webhook reçu:', event.type);

  // Traiter uniquement les paiements réussis
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      await handleSuccessfulPayment(session);
    } catch (error: any) {
      console.error('❌ Erreur traitement paiement:', error.message);
      return NextResponse.json({ error: 'Processing error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email || session.customer_details?.email;
  const amountTotal = session.amount_total || 0;
  const paymentIntentId = session.payment_intent as string;

  console.log('💰 Paiement reçu:', { customerEmail, amountTotal, paymentIntentId });

  if (!customerEmail) {
    throw new Error('Email client non trouvé');
  }

  // Récupérer les line items pour connaître le price_id
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id;

  if (!priceId) {
    throw new Error('Price ID non trouvé');
  }

  const pack = PACKS[priceId as keyof typeof PACKS];
  
  if (!pack) {
    throw new Error(`Pack inconnu pour price_id: ${priceId}`);
  }

  console.log('📦 Pack acheté:', pack);

  // Trouver l'utilisateur par email
  const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (userError) {
    throw new Error(`Erreur recherche utilisateurs: ${userError.message}`);
  }

  const user = users.users.find(u => u.email === customerEmail);
  
  if (!user) {
    throw new Error(`Utilisateur non trouvé pour email: ${customerEmail}`);
  }

  console.log('👤 Utilisateur trouvé:', user.id);

  // 1. Insérer le paiement dans la table payments
  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: user.id,
      stripe_payment_id: paymentIntentId,
      stripe_session_id: session.id,
      amount: amountTotal,
      currency: session.currency || 'eur',
      status: 'succeeded',
      product: pack.name,
      credits_added: pack.credits,
      customer_email: customerEmail,
    });

  if (paymentError) {
    console.error('❌ Erreur insertion payment:', paymentError);
    // On continue quand même pour mettre à jour le profil
  } else {
    console.log('✅ Paiement enregistré dans la base');
  }

  // 2. Récupérer le profil actuel
  const { data: profile, error: profileFetchError } = await supabaseAdmin
    .from('profiles')
    .select('credits, subscription_tier')
    .eq('id', user.id)
    .single();

  if (profileFetchError) {
    throw new Error(`Erreur récupération profil: ${profileFetchError.message}`);
  }

  const currentCredits = profile?.credits || 0;
  const newCredits = currentCredits + pack.credits;

  // 3. Mettre à jour le profil (crédits + tier)
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      credits: newCredits,
      subscription_tier: pack.name,
    })
    .eq('id', user.id);

  if (updateError) {
    throw new Error(`Erreur mise à jour profil: ${updateError.message}`);
  }

  console.log('✅ Profil mis à jour:', { 
    userId: user.id, 
    newCredits, 
    tier: pack.name 
  });

  console.log('🎉 Paiement traité avec succès !');
}
