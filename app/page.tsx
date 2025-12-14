// Landing page
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import ImageCarousel from '@/components/ImageCarousel';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

// Métadonnées SEO exportées depuis metadata.ts
// Les métadonnées de la page home sont définies dans layout.tsx

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Liste des images pour les carousels - toutes les 10 images sur chaque carousel
  const allImages = Array.from({ length: 10 }, (_, i) => `/miniature/imagecarouselle (${i + 1}).jpeg`);
  
  // Utiliser toutes les images sur chaque carousel pour un défilement complet
  const carousel1Images = allImages;
  const carousel2Images = [...allImages].reverse(); // Inversé pour variété
  const carousel3Images = allImages;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section avec carrousels en background */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-screen">
        {/* Carrousels en arrière-plan */}
        <div className="absolute inset-0 z-0">
          {/* Premier carousel - gauche vers droite */}
          <div className="absolute top-0 left-0 w-full">
            <ImageCarousel images={carousel1Images} direction="horizontal" speed={20} reverse={false} />
          </div>
          
          {/* Deuxième carousel - droite vers gauche */}
          <div className="absolute left-0 w-full top-[150px] sm:top-[200px] md:top-[288px]">
            <ImageCarousel images={carousel2Images} direction="horizontal" speed={20} reverse={true} />
          </div>
          
          {/* Troisième carousel - gauche vers droite (visible uniquement sur mobile) */}
          <div className="absolute left-0 w-full top-[300px] md:hidden">
            <ImageCarousel images={carousel3Images} direction="horizontal" speed={10} reverse={false} />
          </div>
          
          {/* Overlay sombre pour assombrir les images - s'arrête à mi-hauteur des stats */}
          <div className="absolute inset-x-0 top-0 bottom-[120px] md:bottom-[230px] bg-black/60 z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-20">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge certifié */}
            <div className="inline-block">
              <span className="px-3 py-2 md:px-6 md:py-2 bg-white text-black text-xs md:text-sm font-medium border-2 border-white">
                {t('home.tagline')}
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-tight" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.8)'}}>
              {t('home.title1')}
              <br />
              <span className="text-youtubeRed" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.8)'}}>{t('home.title2')}</span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
              <button 
                onClick={() => router.push(user ? '/generate' : '/auth')}
                className="w-full sm:w-auto px-6 py-4 sm:px-12 sm:py-5 bg-youtubeRed text-white text-base sm:text-lg font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] sm:hover:translate-x-[4px] sm:hover:translate-y-[4px] transition-all duration-200"
              >
                {t('home.cta')}
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto px-6 py-4 sm:px-12 sm:py-5 bg-white text-black text-base sm:text-lg font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] sm:hover:translate-x-[4px] sm:hover:translate-y-[4px] transition-all duration-200"
              >
                {t('home.demo')}
              </button>
            </div>

            {/* Sous-titre */}
            <p className="text-base sm:text-lg md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
              {t('home.boost')} {t('home.subtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 pt-12 md:pt-16 pb-6 md:pb-8 max-w-4xl mx-auto px-4 relative z-30">
              <div className="text-center p-3 sm:p-4 md:p-6 border-2 md:border-4 border-white bg-white backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-youtubeRed">{t('home.stat1Value')}</div>
                <div className="text-xs sm:text-sm font-medium text-black mt-1 md:mt-2">{t('home.stat1Label')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 md:p-6 border-2 md:border-4 border-white bg-white backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-youtubeRed">{t('home.stat2Value')}</div>
                <div className="text-xs sm:text-sm font-medium text-black mt-1 md:mt-2">{t('home.stat2Label')}</div>
              </div>
              <div className="text-center p-3 sm:p-4 md:p-6 border-2 md:border-4 border-white bg-white backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-youtubeRed">{t('home.stat3Value')}</div>
                <div className="text-xs sm:text-sm font-medium text-black mt-1 md:mt-2">{t('home.stat3Label')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-6 md:py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-black">
            {t('home.finalTitle')}
          </h2>
          <p className="text-xl text-gray-700">
            {t('home.finalSubtitle')}
          </p>
          <button 
            onClick={() => router.push(user ? '/generate' : '/auth')}
            className="px-16 py-6 bg-black text-white text-xl font-bold border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200"
          >
            {t('home.startNow')}
          </button>
        </div>
      </section>

      {/* Modal Démo */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white border-4 border-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-youtubeRed text-white font-bold text-2xl border-4 border-black hover:bg-red-700 transition-colors"
            >
              ×
            </button>
            
            {/* GIF */}
            <div className="w-full">
              <img 
                src="/gif2.gif" 
                alt="Démonstration générateur miniature YouTube IA - MakeMinia création thumbnail professionnelle" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
