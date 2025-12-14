// Page de stockage des images générées
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/hooks/useTranslation';

interface Generation {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  credits_used: number;
}

export default function StoragePage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null);

  // Rediriger si non connecté - MAIS SEULEMENT après avoir vérifié la session
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Charger les générations
  useEffect(() => {
    if (user) {
      loadGenerations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadGenerations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Chargement des générations pour user:', user.id);
      
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Générations chargées:', data?.length || 0);
      setGenerations(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement générations:', error);
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const deleteImage = async (generationId: string, imageUrl: string) => {
    if (!confirm(t('storage.deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/storage/${generationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Recharger les générations après suppression
      await loadGenerations();
      
      // Fermer la modal si l'image supprimée était ouverte
      if (selectedImage?.id === generationId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(t('storage.deleteError'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Afficher un loader pendant la vérification de la session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{t('storage.loading')}</div>
          <div className="text-gray-600">{t('generate.verifyingSession')}</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h1 className="text-4xl font-bold text-black">{t('storage.title')}</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {t('storage.subtitle')}
          </p>
        </div>

        {/* Grille d'images */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-xl text-gray-600">{t('storage.loading')}</div>
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">{t('storage.noImages')}</p>
            <button
              onClick={() => router.push('/generate')}
              className="px-6 py-3 bg-youtubeRed text-white font-bold border-2 border-black hover:bg-red-600 transition-colors"
            >
              {t('storage.createFirst')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="border-4 border-black bg-white overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
              >
                {/* Image */}
                <div
                  className="relative aspect-video bg-gray-100"
                  onClick={() => setSelectedImage(gen)}
                >
                  <img
                    src={gen.image_url}
                    alt={gen.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>

                {/* Informations */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-800 line-clamp-2 font-medium">
                    {gen.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(gen.created_at)}</span>
                    <span className="font-bold">{gen.credits_used} crédit(s)</span>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadImage(gen.image_url, `miniature-${gen.id}.png`)}
                      className="flex-1 px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-youtubeRed hover:border-youtubeRed transition-all"
                    >
                      {t('storage.download')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(gen.id, gen.image_url);
                      }}
                      className="px-4 py-2 bg-white text-black text-sm font-bold border-2 border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal pour agrandir l'image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-youtubeRed text-white font-bold text-2xl border-4 border-black hover:bg-red-700 transition-colors z-10"
            >
              ×
            </button>

            {/* Image agrandie */}
            <div className="bg-white border-4 border-black p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.prompt}
                className="w-full h-auto"
              />

              {/* Détails */}
              <div className="mt-4 space-y-2">
                <p className="text-lg font-bold">{selectedImage.prompt}</p>
                <p className="text-sm text-gray-600">
                  {t('storage.generatedOn')} {formatDate(selectedImage.created_at)}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => downloadImage(selectedImage.image_url, `miniature-${selectedImage.id}.png`)}
                    className="flex-1 px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-youtubeRed hover:border-youtubeRed transition-all"
                  >
                    {t('storage.download')}
                  </button>
                  <button
                    onClick={() => deleteImage(selectedImage.id, selectedImage.image_url)}
                    className="px-6 py-3 bg-white text-black font-bold border-2 border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                  >
                    {t('storage.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
