// Header minimaliste de l'application
import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b-2 border-border py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Thumbnail Generator</h1>
            <p className="text-sm text-textSecondary mt-1">
              Générez des miniatures créatives avec l'IA
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
