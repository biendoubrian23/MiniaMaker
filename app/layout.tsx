import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { 
  getBaseMetadata, 
  getOrganizationSchema, 
  getWebApplicationSchema,
  getWebSiteSchema,
  getSiteNavigationSchema,
  getFAQSchema,
  getHowToSchema,
  getProductSchema
} from '@/lib/metadata';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

// Métadonnées SEO complètes
export const metadata: Metadata = getBaseMetadata('fr');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const webAppSchema = getWebApplicationSchema('fr');
  const webSiteSchema = getWebSiteSchema();
  const navigationSchema = getSiteNavigationSchema();
  const faqSchema = getFAQSchema();
  const howToSchema = getHowToSchema();
  const productSchema = getProductSchema();

  return (
    <html lang="fr">
      <head>
        {/* Preconnect pour performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://nouvdwzhuicfthamuloi.supabase.co" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://www.faireuneminiature.fr" />
        
        {/* Hreflang pour multilingue */}
        <link rel="alternate" hrefLang="fr" href="https://www.faireuneminiature.fr" />
        <link rel="alternate" hrefLang="en" href="https://www.faireuneminiature.fr/en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.faireuneminiature.fr" />

        {/* JSON-LD Structured Data - Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* JSON-LD - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppSchema),
          }}
        />
        {/* JSON-LD - WebSite (pour sitelinks et recherche) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        {/* JSON-LD - Navigation (pour sitelinks Google) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(navigationSchema),
          }}
        />
        {/* JSON-LD - FAQ (rich snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        {/* JSON-LD - HowTo (rich snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
        {/* JSON-LD - Product (pour les packs) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
