// Page Workspace - Génération de miniatures
'use client';

import React, { useState, useEffect } from 'react';
import UploadBox from '@/components/UploadBox';
import PromptBox from '@/components/PromptBox';
import Button from '@/components/Button';
import GeneratedGrid from '@/components/GeneratedGrid';
import { fileToBase64 } from '@/lib/validate';
import type { GenerateResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function WorkspacePage() {
    const { user, profile, refreshProfile } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

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
            router.push('/dashboard/pricing');
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
                    router.push('/dashboard/pricing');
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

    return (
        <div className="p-8 min-h-screen bg-white">
            {/* Titre de la page */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black">{t('sidebar.workspace')}</h1>
                <p className="text-gray-600 mt-1">{t('generate.promptDesc')}</p>
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
                    <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
                    <section className="bg-white border-2 border-border p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setCount(num)}
                                            className={`
                                                px-3 py-3 border-2 font-medium transition-all duration-300 hover:scale-105
                                                ${count === num
                                                    ? 'bg-youtubeRed text-white border-youtubeRed shadow-lg shadow-youtubeRed/50'
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
        </div>
    );
}
