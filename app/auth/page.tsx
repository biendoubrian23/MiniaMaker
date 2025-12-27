// Page de connexion et inscription
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || t('auth.error'));
      setGoogleLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: t('auth.passwordMin') };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: t('auth.passwordNumber') };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation de l'email
      if (!validateEmail(email)) {
        throw new Error(t('auth.invalidEmail'));
      }

      if (isLogin) {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Attendre que onAuthStateChange traite l'événement SIGNED_IN
        await new Promise(resolve => setTimeout(resolve, 100));

        // Rediriger vers le dashboard
        router.refresh();
        router.push('/dashboard/workspace');
      } else {
        // Inscription - Validations supplémentaires
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          throw new Error(passwordValidation.message);
        }

        if (password !== confirmPassword) {
          throw new Error(t('auth.passwordMismatch'));
        }

        if (!name.trim()) {
          throw new Error(t('auth.nameRequired'));
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        // Attendre que onAuthStateChange traite l'événement SIGNED_IN
        await new Promise(resolve => setTimeout(resolve, 100));

        // Rediriger vers le dashboard
        router.refresh();
        router.push('/dashboard/workspace');
      }
    } catch (err: any) {
      setError(err.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-md mx-auto px-4 md:px-6 py-8 md:py-20">
        <div className="bg-white border-2 md:border-4 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Titre */}
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-2 text-center">
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </h1>
          <p className="text-sm md:text-base text-gray-600 text-center mb-6 md:mb-8">
            {isLogin ? t('auth.welcomeTo') : t('auth.join')} <span className="font-bold text-youtubeRed">MiniaMaker</span>
          </p>

          {/* Bouton Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-white text-black text-base md:text-lg font-bold border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? t('auth.loading') : t('auth.continueWithGoogle')}
          </button>

          {/* Séparateur */}
          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs md:text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">{t('auth.or')}</span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs md:text-sm font-bold text-black mb-1 md:mb-2">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black focus:outline-none focus:border-youtubeRed transition-colors"
                  placeholder={t('auth.fullNamePlaceholder')}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs md:text-sm font-bold text-black mb-1 md:mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black focus:outline-none focus:border-youtubeRed transition-colors"
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs md:text-sm font-bold text-black mb-1 md:mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black focus:outline-none focus:border-youtubeRed transition-colors"
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-bold text-black mb-1 md:mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-black focus:outline-none focus:border-youtubeRed transition-colors"
                  placeholder={t('auth.passwordPlaceholder')}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="p-3 md:p-4 bg-red-50 border-2 border-red-500">
                <p className="text-xs md:text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-youtubeRed text-white text-base md:text-lg font-bold border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.loading') : (isLogin ? t('auth.signInBtn') : t('auth.signUpBtn'))}
            </button>
          </form>

          {/* Lien de basculement */}
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs md:text-sm text-gray-600 hover:text-youtubeRed transition-colors"
            >
              {isLogin ? (
                <>
                  {t('auth.noAccount')}{' '}
                  <span className="font-bold">{t('auth.signUpLink')}</span>
                </>
              ) : (
                <>
                  {t('auth.hasAccount')}{' '}
                  <span className="font-bold">{t('auth.signInLink')}</span>
                </>
              )}
            </button>
          </div>

          {/* Séparateur 2 */}
          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
          </div>

          {/* Retour à l'accueil */}
          <Link href="/">
            <button className="w-full px-4 md:px-6 py-2 md:py-3 bg-white text-black text-sm md:text-base font-bold border-2 border-black hover:bg-black hover:text-white transition-all duration-200">
              {t('auth.backHome')}
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
