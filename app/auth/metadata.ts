import { getPageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

// Auth pages ne doivent PAS être indexées
export const metadata: Metadata = {
  ...getPageMetadata('auth', 'fr'),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
