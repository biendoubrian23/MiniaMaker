// Contexte d'authentification
'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Ref pour éviter les initialisations multiples
  const initialized = useRef(false);
  const fetchingProfile = useRef(false);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    // Éviter les appels multiples simultanés
    if (fetchingProfile.current) return null;
    fetchingProfile.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    } finally {
      fetchingProfile.current = false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Éviter les initialisations multiples
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      try {
        setLoading(true);

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Erreur récupération session:', error);
          setUser(null);
          setProfile(null);
          return;
        }

        console.log('🔍 Session:', session?.user ? `User ID: ${session.user.id}` : 'Aucune');

        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          console.log('👤 Profile:', profileData);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('❌ Erreur init auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Ne pas refetch si c'est juste un token refresh
          if (event !== 'TOKEN_REFRESHED') {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      console.log('🔴 Déconnexion...');
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erreur déconnexion:', error);
        return;
      }

      // Clear state immédiatement
      setUser(null);
      setProfile(null);

      console.log('✅ Déconnexion réussie');

      // Utiliser router.push pour une navigation propre
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

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
