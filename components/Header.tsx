// Header de l'application
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { t, language } = useTranslation();

  return (
    <header className="w-full bg-white border-b-4 border-black py-4 md:py-6 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Version Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo et message de bienvenue */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="cursor-pointer">
                <h1 className="text-4xl font-bold text-black">
                  Make<span className="text-youtubeRed">Minia</span>
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  {t('header.subtitle')}
                </p>
              </div>
            </Link>
            {user && profile && (
              <div className="text-sm flex items-center gap-2">
                <span className="text-gray-600">{t('header.hello')}, </span>
                <span className="font-bold text-black">{profile.full_name || profile.email}</span>
                {/* Badge Statut */}
                <span className={`px-2 py-1 text-xs font-bold border-2 ${
                  profile.subscription_tier === 'pro' 
                    ? 'bg-yellow-400 text-black border-yellow-600' 
                    : profile.subscription_tier === 'starter' 
                      ? 'bg-blue-500 text-white border-blue-700' 
                      : 'bg-gray-200 text-gray-700 border-gray-400'
                }`}>
                  {profile.subscription_tier === 'pro' ? '⭐ PRO' : 
                   profile.subscription_tier === 'starter' ? '🚀 STARTER' : 
                   '🆓 ' + t('header.free')}
                </span>
                {/* Badge Crédits */}
                <span className="px-2 py-1 bg-youtubeRed text-white text-xs font-bold">
                  {profile.credits} {t('header.credits')}
                </span>
              </div>
            )}
            {user && !profile && (
              <div className="text-xs text-gray-500">
                {t('header.loading')}
              </div>
            )}
          </div>

          {/* Navigation Desktop */}
          <nav className="flex items-center gap-4">
            <Link href="/pricing">
              <button
                className={`
                  px-6 py-3 text-base font-bold border-2 border-black transition-all duration-200
                  ${pathname === '/pricing' 
                    ? 'bg-youtubeRed text-white border-youtubeRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-black hover:bg-youtubeRed hover:text-white hover:border-youtubeRed hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
              >
                {t('header.pricing')}
              </button>
            </Link>
            {user ? (
              <>
                <Link href="/generate">
                  <button
                    className={`
                      px-6 py-3 text-base font-bold border-2 border-black transition-all duration-200
                      ${pathname === '/generate' 
                        ? 'bg-youtubeRed text-white border-youtubeRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black hover:bg-youtubeRed hover:text-white hover:border-youtubeRed hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }
                    `}
                  >
                    {t('header.space')}
                  </button>
                </Link>
                <button
                  onClick={signOut}
                  className="px-6 py-3 text-base font-bold border-2 border-black transition-all duration-200 bg-white text-black hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {t('header.logout')}
                </button>
                <LanguageSelector variant="desktop" />
              </>
            ) : (
              <>
                <Link href="/auth">
                  <button
                    className={`
                      px-6 py-3 text-base font-bold border-2 border-black transition-all duration-200
                      ${pathname === '/auth' 
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }
                    `}
                  >
                    {t('header.login')}
                  </button>
                </Link>
                <LanguageSelector variant="desktop" />
              </>
            )}
          </nav>
        </div>

        {/* Version Mobile */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Ligne 1 : Logo + Boutons */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-lg font-bold text-black">
                Make<span className="text-youtubeRed">Minia</span>
              </h1>
            </Link>
            
            <nav className="flex items-center gap-1">
              <Link href="/pricing">
                <button
                  className={`
                    px-2 py-1 text-[10px] font-bold border-2 border-black transition-all duration-200
                    ${pathname === '/pricing' 
                      ? 'bg-youtubeRed text-white border-youtubeRed' 
                      : 'bg-white text-black'
                    }
                  `}
                >
                  {t('header.pricing')}
                </button>
              </Link>
              {user ? (
                <>
                  <Link href="/generate">
                    <button
                      className={`
                        px-2 py-1 text-[10px] font-bold border-2 border-black transition-all duration-200
                        ${pathname === '/generate' 
                          ? 'bg-youtubeRed text-white border-youtubeRed' 
                          : 'bg-white text-black'
                        }
                      `}
                    >
                      {t('header.space')}
                    </button>
                  </Link>
                  <button
                    onClick={signOut}
                    className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white text-black"
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <Link href="/auth">
                  <button
                    className={`
                      px-2 py-1 text-[10px] font-bold border-2 border-black transition-all duration-200
                      ${pathname === '/auth' 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black'
                      }
                    `}
                  >
                    {t('header.login')}
                  </button>
                </Link>
              )}
            </nav>
          </div>
          
          {/* Ligne 2 : Bonjour + Crédits + Langue (si connecté) */}
          {user && profile && (
            <div className="flex items-center justify-center gap-2 text-xs border-t border-gray-200 pt-2">
              <span className="text-gray-600">{t('header.hello')},</span>
              <span className="font-bold text-black truncate max-w-[100px]">{profile.full_name || profile.email}</span>
              <span className="px-2 py-0.5 bg-youtubeRed text-white text-[10px] font-bold whitespace-nowrap">
                {profile.credits} {t('header.credits')}
              </span>
              <LanguageSelector variant="mobile" />
            </div>
          )}
          
          {/* Langue pour non connecté mobile */}
          {!user && (
            <div className="flex justify-center border-t border-gray-200 pt-2">
              <LanguageSelector variant="mobile" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
