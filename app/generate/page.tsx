// Page de génération de miniatures
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UploadBox from '@/components/UploadBox';
import PromptBox from '@/components/PromptBox';
import Button from '@/components/Button';
import GeneratedGrid from '@/components/GeneratedGrid';
import { fileToBase64 } from '@/lib/validate';
import type { GenerateResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function GeneratePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // TOUS les useState doivent être AVANT tout return conditionnel
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [inspirationImage, setInspirationImage] = useState<File | null>(null);
  const [extraImage, setExtraImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string>('');
  const [inspirationPreview, setInspirationPreview] = useState<string>('');
  const [extraPreview, setExtraPreview] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Marquer comme monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirection si non connecté
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router, mounted]);

  const handleFaceImage = (file: File) => {
    setFaceImage(file);
    setFacePreview(URL.createObjectURL(file));
  };

  const handleInspirationImage = (file: File) => {
    setInspirationImage(file);
    setInspirationPreview(URL.createObjectURL(file));
  };

  const handleExtraImage = (file: File) => {
    setExtraImage(file);
    setExtraPreview(URL.createObjectURL(file));
  };

  const addQuickPhrase = (text: string) => {
    setPrompt((prev) => {
      if (!prev) return text;
      return prev.endsWith(' ') ? prev + text : prev + ' ' + text;
    });
  };

  const canGenerate = faceImage && inspirationImage && prompt.trim().length >= 10;

  const handleGenerate = async () => {
    if (!profile || profile.credits === 0) {
      router.push('/pricing');
      return;
    }

    if (!canGenerate) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const faceBase64 = await fileToBase64(faceImage!);
      const inspirationBase64 = await fileToBase64(inspirationImage!);
      const extraBase64 = extraImage ? await fileToBase64(extraImage) : null;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faceImageUrl: faceBase64,
          inspirationImageUrl: inspirationBase64,
          extraImageUrl: extraBase64,
          prompt: prompt.trim(),
          count,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          router.push('/pricing');
          return;
        }
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      const data: GenerateResponse = await response.json();
      setGeneratedImages(data.images);

      await fetch('/api/credits/decrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          count,
        }),
      });

      if (refreshProfile) {
        await refreshProfile();
      }

    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Afficher un loader pendant le chargement initial
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-youtubeRed border-r-transparent mb-4"></div>
          <div className="text-xl font-bold text-black">Chargement...</div>
        </div>
      </div>
    );
  }

  // Redirection en cours
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-youtubeRed border-r-transparent mb-4"></div>
          <div className="text-xl font-bold text-black">Redirection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg relative overflow-hidden">
      {/* Lueurs de fond YouTube style */}
      <div className="fixed top-20 right-10 w-[500px] h-[500px] bg-youtubeRed opacity-[0.03] rounded-full blur-3xl animate-glow pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-[600px] h-[600px] bg-youtubeRed opacity-[0.04] rounded-full blur-3xl animate-glow pointer-events-none" style={{animationDelay: '2s'}}></div>
      <div className="fixed top-1/2 left-1/2 w-[400px] h-[400px] bg-youtubeRed opacity-[0.02] rounded-full blur-3xl animate-float pointer-events-none"></div>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Lien vers Stockage Images */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/storage')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black font-bold hover:bg-youtubeRed hover:text-white hover:border-youtubeRed transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {t('storage.title').toUpperCase()}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne Gauche : Uploads et Prompt */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section Uploads */}
            <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <div className="absolute top-0 left-0 w-1 h-12 bg-youtubeRed"></div>
              <h2 className="text-xl font-bold text-textPrimary mb-6">
                {t('generate.refImages')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UploadBox
                  label={t('generate.faceImage')}
                  description={t('generate.faceImageDesc')}
                  onImageSelect={handleFaceImage}
                  currentImage={facePreview}
                />
                
                <UploadBox
                  label={t('generate.inspirationImage')}
                  description={t('generate.inspirationImageDesc')}
                  onImageSelect={handleInspirationImage}
                  currentImage={inspirationPreview}
                />
                
                <UploadBox
                  label={t('generate.extraImage')}
                  description={t('generate.extraImageDesc')}
                  onImageSelect={handleExtraImage}
                  currentImage={extraPreview}
                />
              </div>
            </section>

            {/* Section Prompt */}
            <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="absolute top-0 left-0 w-1 h-12 bg-youtubeRed"></div>
              <h2 className="text-xl font-bold text-textPrimary mb-6">
                {t('generate.promptTitle')}
              </h2>
              
              <PromptBox value={prompt} onChange={setPrompt} />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => addQuickPhrase(t('generate.quickPhrase1'))}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  {t('generate.quickBtn1')}
                </button>
                <button
                  onClick={() => addQuickPhrase(t('generate.quickPhrase2'))}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  {t('generate.quickBtn2')}
                </button>
                <button
                  onClick={() => addQuickPhrase(t('generate.quickPhrase3'))}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  {t('generate.quickBtn3')}
                </button>
              </div>
            </section>
          </div>

          {/* Colonne Droite : Options et Résultats */}
          <div className="lg:col-span-4 space-y-8">
            {/* Section Options de génération */}
            <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="absolute top-0 left-0 w-1 h-12 bg-youtubeRed"></div>
              <h2 className="text-xl font-bold text-textPrimary mb-6">
                {t('generate.genOptions')}
              </h2>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium text-textPrimary mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-youtubeRed"></span>
                    {t('generate.imageCount')}
                  </label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCount(num)}
                        className={`
                          px-6 py-3 border-2 font-medium transition-all duration-300 hover:scale-110
                          ${
                            count === num
                              ? 'bg-youtubeRed text-white border-youtubeRed shadow-lg shadow-youtubeRed/50 scale-105'
                              : 'bg-white text-textPrimary border-border hover:border-youtubeRed hover:shadow-md'
                          }
                        `}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    loading={loading}
                    className="w-full"
                  >
                    {t('generate.generateBtn')}
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 p-4 border-2 border-red-500 bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Section Miniatures générées */}
            {(loading || generatedImages.length > 0) && (
              <section className="bg-white border-2 border-border p-8">
                <GeneratedGrid images={generatedImages} loading={loading} />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
