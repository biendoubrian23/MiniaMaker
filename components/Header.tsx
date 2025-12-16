// Header de l'application - Version simplifiée pour pages publiques
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="w-full bg-white border-b-4 border-black py-4 md:py-6 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Version Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
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
                <Link href="/dashboard/workspace">
                  <button
                    className="px-6 py-3 text-base font-bold border-2 border-black transition-all duration-200 bg-youtubeRed text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    {t('header.space')}
                  </button>
                </Link>
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
                <Link href="/dashboard/workspace">
                  <button
                    className="px-2 py-1 text-[10px] font-bold border-2 border-youtubeRed bg-youtubeRed text-white"
                  >
                    {t('header.space')}
                  </button>
                </Link>
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

          {/* Ligne 2 : Langue */}
          <div className="flex justify-center border-t border-gray-200 pt-2">
            <LanguageSelector variant="mobile" />
          </div>
        </div>
      </div>
    </header>
  );
}
