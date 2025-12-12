// Composant UploadBox pour l'upload d'images
'use client';

import React, { useRef, useState } from 'react';
import { validateImageFile } from '@/lib/validate';

interface UploadBoxProps {
  label: string;
  description: string;
  onImageSelect: (file: File) => void;
  currentImage?: string;
}

export default function UploadBox({
  label,
  description,
  onImageSelect,
  currentImage,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Erreur de validation');
      return;
    }

    onImageSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-textPrimary">
        {label}
      </label>
      <p className="text-xs text-textSecondary mb-2">{description}</p>
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative w-full h-48 border-2 bg-white
          flex items-center justify-center
          cursor-pointer transition-all duration-200
          ${isDragging ? 'border-textPrimary bg-lightBg' : 'border-border hover:border-textSecondary'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        {currentImage ? (
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
              <span className="text-white opacity-0 hover:opacity-100 font-medium">
                Cliquer pour changer
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className="mb-3">
              <svg
                className="mx-auto h-12 w-12 text-textSecondary"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>
            <p className="text-sm text-textPrimary font-medium mb-1">
              Cliquez ou glissez une image
            </p>
            <p className="text-xs text-textSecondary">
              PNG, JPG, JPEG, WEBP • Max 10 Mo
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
