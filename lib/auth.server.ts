// Utilitaire d'authentification côté serveur
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseProjectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'nouvdwzhuicfthamuloi';

/**
 * Récupère l'utilisateur authentifié depuis le header Authorization ou les cookies
 * À utiliser dans les API routes pour valider l'authentification côté serveur
 */
export async function getAuthenticatedUser() {
  try {
    // 1. PRIORITÉ: Vérifier le header Authorization (envoyé par le client)
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const user = await tryGetUserWithToken(token);
      if (user) {
        console.log('✅ Utilisateur authentifié via header Authorization');
        return user;
      }
    }
    
    // 2. FALLBACK: Essayer les cookies (pour les cas où le header n'est pas envoyé)
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    console.log('🔍 Cookies disponibles:', allCookies.map(c => c.name));
    
    // Liste des noms de cookies possibles (différents formats Supabase)
    const possibleCookieNames = [
      'sb-access-token',
      `sb-${supabaseProjectRef}-auth-token`,
      `sb-${supabaseProjectRef}-auth-token.0`, // Format chunked
      `sb-${supabaseProjectRef}-auth-token.1`,
    ];
    
    // 1. Essayer les cookies directs d'accès
    for (const name of possibleCookieNames) {
      const cookie = cookieStore.get(name);
      if (cookie?.value) {
        // Essayer si c'est un token direct
        if (!cookie.value.startsWith('{') && !cookie.value.startsWith('base64-')) {
          const user = await tryGetUserWithToken(cookie.value);
          if (user) return user;
        }
      }
    }
    
    // 2. Essayer de reconstruire les cookies chunked (format SSR)
    const chunkedCookies = allCookies
      .filter(c => c.name.startsWith(`sb-${supabaseProjectRef}-auth-token.`))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    if (chunkedCookies.length > 0) {
      const combinedValue = chunkedCookies.map(c => c.value).join('');
      const user = await tryParseAndGetUser(combinedValue);
      if (user) return user;
    }
    
    // 3. Essayer tous les cookies contenant 'auth-token'
    for (const cookie of allCookies) {
      if (cookie.name.includes('auth-token') || cookie.name.includes('supabase')) {
        const user = await tryParseAndGetUser(cookie.value);
        if (user) return user;
      }
    }
    
    console.log('⚠️ Aucun cookie d\'authentification valide trouvé');
    return null;

  } catch (error) {
    console.error('Erreur getAuthenticatedUser:', error);
    return null;
  }
}

// Helper: essayer de récupérer l'utilisateur avec un token direct
async function tryGetUserWithToken(accessToken: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user) {
      console.log('✅ Utilisateur authentifié via token direct');
      return user;
    }
  } catch {
    // Ignorer
  }
  return null;
}

// Helper: essayer de parser un cookie JSON et récupérer l'utilisateur
async function tryParseAndGetUser(cookieValue: string) {
  try {
    // Essayer de décoder base64 si nécessaire
    let value = cookieValue;
    if (value.startsWith('base64-')) {
      value = Buffer.from(value.slice(7), 'base64').toString('utf-8');
    }
    
    // Essayer de parser comme JSON
    const parsed = JSON.parse(value);
    const accessToken = parsed?.access_token || parsed?.token?.access_token;
    
    if (accessToken) {
      return await tryGetUserWithToken(accessToken);
    }
  } catch {
    // Pas du JSON valide, ignorer
  }
  return null;
}
