// Carousel d'images avec défilement infini et smooth
'use client';

import React from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  reverse?: boolean;
}

export default function ImageCarousel({ 
  images, 
  direction = 'horizontal',
  speed = 30,
  reverse = false
}: ImageCarouselProps) {
  // Dupliquer exactement 2 fois pour boucle parfaite avec translate -50%
  const duplicatedImages = [...images, ...images];

  return (
    <div className={`
      overflow-hidden relative
      ${direction === 'horizontal' ? 'h-[150px] sm:h-[200px] md:h-[288px]' : 'h-[600px] w-full'}
    `}>
      <div
        className={`
          flex gap-4 md:gap-8
          ${direction === 'horizontal' 
            ? (reverse ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal')
            : 'flex-col animate-scroll-vertical'
          }
        `}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 group w-[250px] h-[140px] sm:w-[350px] sm:h-[200px] md:w-[448px] md:h-[256px]"
          >
            <div className="relative w-full h-full overflow-hidden border-2 md:border-4 border-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:shadow-youtubeRed/30">
              <Image
                src={image}
                alt={`Exemple miniature YouTube professionnelle ${index + 1} - Créée avec générateur IA MakeMinia`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 250px, (max-width: 768px) 350px, 448px"
                priority={index < 8}
              />
              {/* Overlay sur hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Gradients de fade sur les bords */}
      {direction === 'horizontal' ? (
        <>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </>
      )}
    </div>
  );
}
