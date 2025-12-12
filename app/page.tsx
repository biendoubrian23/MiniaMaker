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

      // Appeler l'API de génération
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
    <div className="min-h-screen bg-lightBg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Uploads */}
        <section className="bg-white border-2 border-border p-8 mb-8">
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
        <section className="bg-white border-2 border-border p-8 mb-8">
          <h2 className="text-xl font-bold text-textPrimary mb-6">
            Description de la miniature
          </h2>
          
          <PromptBox value={prompt} onChange={setPrompt} />
        </section>

        {/* Section Options de génération */}
        <section className="bg-white border-2 border-border p-8 mb-8">
          <h2 className="text-xl font-bold text-textPrimary mb-6">
            Options de génération
          </h2>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label className="text-sm font-medium text-textPrimary mb-2 block">
                Nombre d'images à générer
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={`
                      px-6 py-3 border-2 font-medium transition-all
                      ${
                        count === num
                          ? 'bg-textPrimary text-white border-textPrimary'
                          : 'bg-white text-textPrimary border-border hover:border-textSecondary'
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
                className="w-full md:w-auto"
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
      </main>
    </div>
  );
}
