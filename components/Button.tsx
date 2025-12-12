// Composant Button réutilisable avec design minimaliste
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 font-medium transition-all duration-200 border-2';
  
  const variantStyles = {
    primary: 'bg-textPrimary text-white border-textPrimary hover:bg-youtubeRed hover:border-youtubeRed hover:shadow-lg hover:shadow-youtubeRed/50 hover:scale-105 disabled:bg-gray-300 disabled:border-gray-300 disabled:hover:scale-100 disabled:hover:shadow-none transition-all',
    secondary: 'bg-white text-textPrimary border-border hover:border-youtubeRed hover:text-youtubeRed hover:shadow-md hover:scale-105 disabled:text-gray-300 disabled:border-gray-200 disabled:hover:scale-100 disabled:hover:shadow-none transition-all',
  };

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
          <span className="ml-2">Génération...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
