// Composant de sélection de langue avec dropdown
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'desktop' | 'mobile';
}

export default function LanguageSelector({ variant = 'desktop' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (code: 'fr' | 'en') => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 text-xs font-bold border-2 border-black bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2"
          title="Langue / Language"
        >
          <span className="text-base">{currentLang.flag}</span>
          <span>{currentLang.code.toUpperCase()}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 min-w-[140px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code as 'fr' | 'en')}
                className={`w-full px-4 py-3 text-sm font-bold text-left hover:bg-gray-100 transition-all flex items-center gap-3 ${language === lang.code ? 'bg-youtubeRed text-white hover:bg-red-600' : 'text-black'
                  }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop variant - dropdown s'ouvre vers le haut
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 text-base font-bold border-2 border-black bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2"
        title="Change language"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span>{currentLang.code.toUpperCase()}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code as 'fr' | 'en')}
              className={`w-full px-4 py-3 text-sm font-bold text-left hover:bg-gray-100 transition-all flex items-center gap-3 ${language === lang.code ? 'bg-youtubeRed text-white hover:bg-red-600' : 'text-black'
                }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

