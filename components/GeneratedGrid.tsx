// Composant GeneratedGrid pour afficher les miniatures générées
'use client';

import React from 'react';
import Button from './Button';

interface GeneratedGridProps {
  images: string[];
  loading?: boolean;
}

export default function GeneratedGrid({ images, loading = false }: GeneratedGridProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative w-full h-64 border-2 border-border bg-lightBg flex items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-textPrimary border-t-transparent animate-spin mb-3" />
                <p className="text-sm text-textSecondary">Génération en cours...</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group border-2 border-border bg-white overflow-hidden transition-transform duration-200 hover:scale-[1.03]"
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
                  onClick={() => handleDownload(image, index)}
                  className="bg-white"
                >
                  Télécharger
                </Button>
              </div>
            </div>

            <div className="p-3 border-t-2 border-border">
              <p className="text-xs text-textSecondary">
                Miniature {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
