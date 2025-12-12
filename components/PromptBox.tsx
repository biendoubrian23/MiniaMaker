// Composant PromptBox pour la saisie du prompt
'use client';

import React, { useState } from 'react';
import { validatePrompt } from '@/lib/validate';

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptBox({ value, onChange }: PromptBoxProps) {
  const [error, setError] = useState<string | null>(null);
  const minLength = 10;
  const maxLength = 2000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validation en temps réel
    if (newValue.trim().length > 0) {
      const validation = validatePrompt(newValue);
      setError(validation.valid ? null : validation.error || null);
    } else {
      setError(null);
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-textPrimary flex items-center gap-2">
        <span className="w-1 h-4 bg-youtubeRed"></span>
        Prompt de génération
      </label>
      <p className="text-xs text-textSecondary mb-2">
        Décrivez précisément la miniature que vous souhaitez générer (minimum {minLength} caractères)
      </p>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Décrivez la miniature à générer..."
        className={`
          w-full h-32 px-4 py-3 border-2 bg-white
          text-textPrimary placeholder-textSecondary
          resize-none focus:outline-none transition-colors
          ${error ? 'border-red-500' : 'border-border focus:border-textPrimary'}
        `}
        maxLength={maxLength}
      />

      <div className="flex items-center justify-between">
        <div>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
        <p
          className={`text-xs ${
            isNearLimit ? 'text-red-500' : 'text-textSecondary'
          }`}
        >
          {characterCount} / {maxLength}
        </p>
      </div>
    </div>
  );
}
