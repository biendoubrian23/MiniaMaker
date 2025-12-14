import { getPageMetadata, getSoftwareApplicationSchema } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = getPageMetadata('pricing', 'fr');

// Schema pour les pricing
export function getPricingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'MakeMinia Credits',
    description: 'Crédits pour générer des miniatures YouTube professionnelles',
    offers: [
      {
        '@type': 'Offer',
        name: 'Pack Starter',
        price: '4.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: '50 crédits',
        },
      },
      {
        '@type': 'Offer',
        name: 'Pack Pro',
        price: '9.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: '120 crédits',
        },
      },
      {
        '@type': 'Offer',
        name: 'Pack Business',
        price: '19.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: '300 crédits',
        },
      },
    ],
  };
}
