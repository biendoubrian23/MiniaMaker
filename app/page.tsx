// Page principale de l'application
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadBox from '@/components/UploadBox';
import PromptBox from '@/components/PromptBox';
import Button from '@/components/Button';
import GeneratedGrid from '@/components/GeneratedGrid';
import { fileToBase64 } from '@/lib/validate';
import type { GenerateResponse } from '@/types';

export default function Home() {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [inspirationImage, setInspirationImage] = useState<File | null>(null);
  const [extraImage, setExtraImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Prévisualisation des images
  const [facePreview, setFacePreview] = useState<string>('');
  const [inspirationPreview, setInspirationPreview] = useState<string>('');
  const [extraPreview, setExtraPreview] = useState<string>('');

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

  const canGenerate = faceImage && inspirationImage && extraImage && prompt.trim().length >= 10;

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      // Convertir les images en base64
      const faceBase64 = await fileToBase64(faceImage!);
      const inspirationBase64 = await fileToBase64(inspirationImage!);
      const extraBase64 = await fileToBase64(extraImage!);

      // Appeler l'API de génération (OPTIMISÉE)
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      const data: GenerateResponse = await response.json();
      setGeneratedImages(data.images);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lightBg relative overflow-hidden">
      {/* Lueurs de fond YouTube style */}
      <div className="fixed top-20 right-10 w-[500px] h-[500px] bg-youtubeRed opacity-[0.03] rounded-full blur-3xl animate-glow pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-[600px] h-[600px] bg-youtubeRed opacity-[0.04] rounded-full blur-3xl animate-glow pointer-events-none" style={{animationDelay: '2s'}}></div>
      <div className="fixed top-1/2 left-1/2 w-[400px] h-[400px] bg-youtubeRed opacity-[0.02] rounded-full blur-3xl animate-float pointer-events-none"></div>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne Gauche : Uploads et Prompt */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section Uploads */}
            <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <div className="absolute top-0 left-0 w-1 h-12 bg-youtubeRed"></div>
              <h2 className="text-xl font-bold text-textPrimary mb-6">
                Images de référence
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UploadBox
                  label="Face Image"
                  description="Uploadez une photo de visage"
                  onImageSelect={handleFaceImage}
                  currentImage={facePreview}
                />
                
                <UploadBox
                  label="Inspiration Image"
                  description="Image de référence pour le style"
                  onImageSelect={handleInspirationImage}
                  currentImage={inspirationPreview}
                />
                
                <UploadBox
                  label="Extra Image"
                  description="Objet, outil ou symbole additionnel"
                  onImageSelect={handleExtraImage}
                  currentImage={extraPreview}
                />
              </div>
            </section>

            {/* Section Prompt */}
            <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="absolute top-0 left-0 w-1 h-12 bg-youtubeRed"></div>
              <h2 className="text-xl font-bold text-textPrimary mb-6">
                Description de la miniature
              </h2>
              
              <PromptBox value={prompt} onChange={setPrompt} />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => addQuickPhrase("Génère une image de moi en t'inspirant exactement de l'image de référence")}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  + Inspiration Visage
                </button>
                <button
                  onClick={() => addQuickPhrase("Intègre l'objet de l'image extra dans la scène de manière réaliste")}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  + Avec Objet Extra
                </button>
                <button
                  onClick={() => addQuickPhrase("Reproduis fidèlement le style, l'éclairage et la composition de l'image d'inspiration")}
                  className="text-xs bg-gray-100 hover:bg-youtubeRed hover:text-white text-textPrimary px-3 py-2 rounded border border-gray-300 hover:border-youtubeRed transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  + Style & Compo
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
                Options de génération
              </h2>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium text-textPrimary mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-youtubeRed"></span>
                    Nombre d'images à générer
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
                    Générer les miniatures
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
