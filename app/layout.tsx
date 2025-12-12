import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thumbnail Generator - Génération de miniatures avec IA',
  description: 'Générez des miniatures créatives pour YouTube avec l\'intelligence artificielle',
  keywords: 'thumbnail, miniature, YouTube, IA, génération, image',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
