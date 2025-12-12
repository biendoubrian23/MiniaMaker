// Header minimaliste de l'application
import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b-2 border-border py-6 relative overflow-hidden">
      {/* Lueur rouge animée en fond */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-youtubeRed opacity-5 rounded-full blur-3xl animate-glow"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-youtubeRed opacity-10 rounded-full blur-3xl animate-glow" style={{animationDelay: '1.5s'}}></div>
      
      {/* Accent rouge subtil */}
      <div className="absolute top-0 left-0 w-16 h-1 bg-youtubeRed shadow-lg shadow-youtubeRed/50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-textPrimary">
              Make<span className="text-youtubeRed drop-shadow-lg">Minia</span>
            </h1>
            <p className="text-sm text-textSecondary mt-1">
              Générez des miniatures créatives avec l'IA
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
