// Contexte d'authentification
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  sessionChecked: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('📡 Fetching profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched:', data);
      return data as Profile;
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
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
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('❌ Erreur initAuth:', error);
      } finally {
        if (isMounted) {
          console.log('✅ Auth initialisé - loading=false, sessionChecked=true');
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    // Timeout de sécurité - forcer la fin après 3 secondes
    timeoutId = setTimeout(() => {
      if (isMounted && (loading || !sessionChecked)) {
        console.warn('⚠️ Timeout Auth - Forcer fin du loading');
        setLoading(false);
        setSessionChecked(true);
      }
    }, 3000);

    initAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.id);
      
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        // Ne pas refetch le profile si c'est juste un TOKEN_REFRESHED
        if (event !== 'TOKEN_REFRESHED') {
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      
      // Toujours s'assurer que le loading est terminé
      if (isMounted) {
        setLoading(false);
        setSessionChecked(true);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

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
    <AuthContext.Provider value={{ user, profile, loading, sessionChecked, signOut, refreshProfile }}>
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
