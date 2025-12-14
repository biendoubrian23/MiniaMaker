// Page de connexion et inscription
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
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
  const [error, setError] = useState<string | null>(null);

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

        // Redirection vers /generate après connexion réussie
        router.push('/generate');
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

        // Redirection vers /generate après inscription réussie
        router.push('/generate');
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

          {/* Séparateur */}
          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs md:text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">{t('auth.or')}</span>
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
    </div>
  );
}
