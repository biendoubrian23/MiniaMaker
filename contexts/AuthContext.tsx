// Contexte d'authentification
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  sessionChecked: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  // Ref pour éviter les doubles appels
  const profileFetchedRef = useRef<string | null>(null);
  const initCompletedRef = useRef(false);

  // Fonction de récupération du profil avec retry
  const fetchProfile = useCallback(async (userId: string, retryCount = 0): Promise<Profile | null> => {
    try {
      console.log('📡 Fetching profile for:', userId, retryCount > 0 ? `(retry ${retryCount})` : '');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        // Retry jusqu'à 3 fois avec délai croissant
        if (retryCount < 3) {
          await new Promise(r => setTimeout(r, 500 * (retryCount + 1)));
          return fetchProfile(userId, retryCount + 1);
        }
        return null;
      }

      console.log('✅ Profile fetched:', data);
      return data as Profile;
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      if (retryCount < 3) {
        await new Promise(r => setTimeout(r, 500 * (retryCount + 1)));
        return fetchProfile(userId, retryCount + 1);
      }
      return null;
    }
  }, []);

  // Refresh profile public
  const refreshProfile = useCallback(async () => {
    if (user) {
      profileFetchedRef.current = null; // Reset pour forcer le refresh
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  // Effet principal d'initialisation
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Éviter les doubles initialisations
      if (initCompletedRef.current) return;
      
      try {
        console.log('🚀 Initialisation Auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur getSession:', error);
        }
        
        if (!isMounted) return;

        console.log('🔍 Session:', session?.user ? `User ${session.user.id}` : 'Aucune');
        
        if (session?.user) {
          setUser(session.user);
          
          // Charger le profil (ne bloque pas le rendu)
          fetchProfile(session.user.id).then(profileData => {
            if (isMounted && profileData) {
              setProfile(profileData);
              profileFetchedRef.current = session.user.id;
            }
          });
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('❌ Erreur initAuth:', error);
      } finally {
        if (isMounted) {
          console.log('✅ Auth initialisé');
          setLoading(false);
          setSessionChecked(true);
          initCompletedRef.current = true;
        }
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.id);
      
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        
        // Toujours charger le profil lors d'un changement d'état (sauf TOKEN_REFRESHED)
        if (event !== 'TOKEN_REFRESHED' || !profile) {
          const profileData = await fetchProfile(session.user.id);
          if (isMounted && profileData) {
            setProfile(profileData);
            profileFetchedRef.current = session.user.id;
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        profileFetchedRef.current = null;
      }
      
      // Toujours s'assurer que le loading est terminé
      if (isMounted) {
        setLoading(false);
        setSessionChecked(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Effet séparé pour charger le profil si user existe mais pas le profil
  useEffect(() => {
    if (user && !profile && profileFetchedRef.current !== user.id) {
      console.log('🔄 Profil manquant, rechargement...');
      fetchProfile(user.id).then(profileData => {
        if (profileData) {
          setProfile(profileData);
          profileFetchedRef.current = user.id;
        }
      });
    }
  }, [user, profile, fetchProfile]);

  // Récupérer le token d'accès pour les appels API authentifiés
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Erreur getAccessToken:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔴 Déconnexion en cours...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return;
      }
      setUser(null);
      setProfile(null);
      console.log('✅ Déconnexion réussie');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, sessionChecked, signOut, refreshProfile, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
