// Composant GeneratedGrid pour afficher les miniatures générées
'use client';

import React, { useState } from 'react';
import Button from './Button';

interface GeneratedGridProps {
  images: string[];
  loading?: boolean;
}

export default function GeneratedGrid({ images, loading = false }: GeneratedGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thumbnail-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-textPrimary mb-4">
          Miniatures générées
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative w-full aspect-video border-2 border-border bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden"
            >
              {/* Barre de progression animée */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-youtubeRed via-red-500 to-youtubeRed animate-pulse"
                  style={{
                    width: '70%',
                    animation: 'shimmer 2s ease-in-out infinite'
                  }}
                />
              </div>
              
              {/* Cercle spinner stylé */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-youtubeRed border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-medium text-textPrimary animate-pulse">Génération en cours...</p>
                <p className="text-xs text-textSecondary mt-1">Image {i}/2</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-textPrimary mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-youtubeRed"></span>
        Miniatures générées
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group border-2 border-border bg-white overflow-hidden transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-video w-full">
              <img
                src={image}
                alt={`Miniature générée ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleDownload(image, index);
                  }}
                  className="bg-white"
                >
                  Télécharger
                </Button>
              </div>
            </div>

            <div className="p-3 border-t-2 border-border">
              <p className="text-xs text-textSecondary">
                Miniature {index + 1} (Cliquer pour agrandir)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Aperçu plein écran */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 focus:outline-none"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <img 
            src={selectedImage} 
            alt="Aperçu plein écran" 
            className="max-w-full max-h-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
