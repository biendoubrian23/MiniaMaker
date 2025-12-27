// Page de callback pour l'authentification OAuth (Google, etc.)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Récupérer la session depuis l'URL (hash fragment)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur callback:', error);
          setError(error.message);
          setTimeout(() => router.push('/auth?error=callback_error'), 2000);
          return;
        }

        if (data.session) {
          // Session trouvée, rediriger vers le dashboard
          router.push('/dashboard/workspace');
        } else {
          // Pas de session, essayer de récupérer depuis le hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            // Définir la session manuellement
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (setSessionError) {
              console.error('Erreur setSession:', setSessionError);
              setError(setSessionError.message);
              setTimeout(() => router.push('/auth?error=callback_error'), 2000);
              return;
            }

            router.push('/dashboard/workspace');
          } else {
            // Aucun token trouvé
            router.push('/auth?error=no_token');
          }
        }
      } catch (err) {
        console.error('Erreur inattendue:', err);
        setError('Une erreur inattendue est survenue');
        setTimeout(() => router.push('/auth?error=callback_error'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-xl mb-4">❌ Erreur</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-gray-400 mt-2">Redirection...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-youtubeRed mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Connexion en cours...</p>
          </>
        )}
      </div>
    </div>
  );
}
