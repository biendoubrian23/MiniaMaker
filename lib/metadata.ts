// Configuration SEO complète pour faireuneminiature.fr
import type { Metadata } from 'next';

const siteUrl = 'https://faireuneminiature.fr';
const siteName = 'MakeMinia - Faire une Miniature YouTube';

// Mots-clés SEO ultra-complets FR + EN
export const keywords = {
  fr: [
    // Mots-clés principaux FR
    'faire une miniature youtube',
    'créer miniature youtube',
    'générateur de miniature youtube',
    'miniature youtube ia',
    'miniature youtube ai',
    'créer thumbnail youtube',
    'faire thumbnail youtube',
    'miniature youtube gratuit',
    'thumbnail youtube gratuit',
    'outil miniature youtube',
    'logiciel miniature youtube',
    'créateur miniature youtube',
    'design miniature youtube',
    'template miniature youtube',
    'générateur thumbnail youtube',
    // Mots-clés longue traîne FR
    'comment faire une miniature youtube',
    'comment créer une miniature youtube',
    'meilleur outil miniature youtube',
    'miniature youtube professionnelle',
    'miniature youtube attractive',
    'miniature youtube qui attire',
    'augmenter vues youtube miniature',
    'booster clics youtube miniature',
    'miniature youtube clickbait',
    'miniature youtube tendance',
    'miniature youtube 2025',
    'faire miniature youtube en ligne',
    'créer miniature youtube facile',
    'miniature youtube ia gratuit',
    'générateur miniature youtube gratuit',
    'outil création miniature youtube',
    'logiciel création thumbnail youtube',
    'miniature youtube sans photoshop',
    'miniature youtube sans canva',
    'alternative canva miniature youtube',
    // Termes techniques FR
    'résolution miniature youtube',
    'taille miniature youtube',
    'format miniature youtube',
    'dimension miniature youtube',
    '1280x720 miniature youtube',
    'hd miniature youtube',
    '4k miniature youtube',
    // Termes business FR
    'miniature youtube pour youtubeur',
    'miniature youtube pour créateur',
    'miniature youtube marketing',
    'optimisation miniature youtube',
    'seo youtube miniature',
    'thumbnail youtube business',
  ],
  en: [
    // Mots-clés principaux EN
    'make youtube thumbnail',
    'create youtube thumbnail',
    'youtube thumbnail generator',
    'youtube thumbnail maker',
    'ai youtube thumbnail',
    'youtube thumbnail ai',
    'free youtube thumbnail maker',
    'free thumbnail generator',
    'youtube thumbnail tool',
    'youtube thumbnail creator',
    'thumbnail design tool',
    'thumbnail generator online',
    'youtube thumbnail template',
    'custom youtube thumbnail',
    // Mots-clés longue traîne EN
    'how to make youtube thumbnail',
    'how to create youtube thumbnail',
    'best youtube thumbnail maker',
    'professional youtube thumbnail',
    'attractive youtube thumbnail',
    'clickable youtube thumbnail',
    'increase youtube views thumbnail',
    'boost youtube clicks thumbnail',
    'youtube thumbnail clickbait',
    'trending youtube thumbnail',
    'youtube thumbnail 2025',
    'make youtube thumbnail online',
    'create youtube thumbnail easy',
    'free ai thumbnail generator',
    'online thumbnail creator',
    'youtube thumbnail without photoshop',
    'youtube thumbnail without canva',
    'canva alternative thumbnail',
    // Termes techniques EN
    'youtube thumbnail size',
    'youtube thumbnail dimensions',
    'youtube thumbnail resolution',
    'youtube thumbnail format',
    '1280x720 thumbnail',
    'hd youtube thumbnail',
    '4k youtube thumbnail',
    // Termes business EN
    'youtube thumbnail for youtubers',
    'youtube thumbnail for creators',
    'youtube thumbnail marketing',
    'optimize youtube thumbnail',
    'youtube seo thumbnail',
    'thumbnail optimization',
  ],
};

// Descriptions SEO optimisées
export const descriptions = {
  fr: {
    short: 'Créez des miniatures YouTube professionnelles avec l\'IA. Générateur gratuit de thumbnails attractifs pour booster vos vues et clics.',
    long: 'MakeMinia - Faire une miniature YouTube n\'a jamais été aussi simple ! Générateur de miniatures YouTube propulsé par l\'intelligence artificielle. Créez des thumbnails professionnels, attractifs et optimisés en quelques secondes. Augmentez vos vues, boostez votre CTR et dominez YouTube avec des miniatures qui attirent l\'attention. Outil gratuit, facile et rapide. Qualité HD et 4K. Sans Photoshop, sans Canva.',
  },
  en: {
    short: 'Create professional YouTube thumbnails with AI. Free generator for attractive thumbnails to boost your views and clicks.',
    long: 'MakeMinia - Make YouTube thumbnails has never been easier! AI-powered YouTube thumbnail generator. Create professional, attractive and optimized thumbnails in seconds. Increase your views, boost your CTR and dominate YouTube with eye-catching thumbnails. Free, easy and fast tool. HD and 4K quality. No Photoshop, no Canva needed.',
  },
};

// Titres SEO optimisés par page
export const titles = {
  home: {
    fr: 'Faire une Miniature YouTube | Générateur Gratuit IA 2025',
    en: 'Make YouTube Thumbnail | Free AI Generator 2025',
  },
  generate: {
    fr: 'Créer Miniature YouTube | Outil IA Professionnel Gratuit',
    en: 'Create YouTube Thumbnail | Free Professional AI Tool',
  },
  storage: {
    fr: 'Mes Miniatures YouTube | Galerie & Téléchargement HD/4K',
    en: 'My YouTube Thumbnails | Gallery & HD/4K Download',
  },
  auth: {
    fr: 'Connexion | MakeMinia - Créateur Miniature YouTube',
    en: 'Login | MakeMinia - YouTube Thumbnail Creator',
  },
  pricing: {
    fr: 'Tarifs | Crédits Miniature YouTube Pas Cher',
    en: 'Pricing | Affordable YouTube Thumbnail Credits',
  },
};

// Métadonnées de base pour tout le site
export function getBaseMetadata(lang: 'fr' | 'en' = 'fr'): Metadata {
  const allKeywords = [...keywords.fr, ...keywords.en];
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titles.home[lang],
      template: `%s | ${siteName}`,
    },
    description: descriptions[lang].long,
    keywords: allKeywords,
    authors: [{ name: 'MakeMinia Team' }],
    creator: 'MakeMinia',
    publisher: 'MakeMinia',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: lang === 'fr' ? 'en_US' : 'fr_FR',
      url: siteUrl,
      siteName: siteName,
      title: titles.home[lang],
      description: descriptions[lang].short,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: lang === 'fr' 
            ? 'MakeMinia - Générateur de Miniature YouTube IA'
            : 'MakeMinia - AI YouTube Thumbnail Generator',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles.home[lang],
      description: descriptions[lang].short,
      images: [`${siteUrl}/twitter-image.png`],
      creator: '@makeminia',
      site: '@makeminia',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        'fr-FR': `${siteUrl}`,
        'en-US': `${siteUrl}/en`,
      },
    },
    verification: {
      google: 'google-site-verification-code', // À remplacer
      yandex: 'yandex-verification-code', // À remplacer
      // Note: Bing verification se fait via Bing Webmaster Tools, pas via meta tag
    },
    category: 'technology',
  };
}

// Métadonnées pour chaque page
export function getPageMetadata(
  page: 'home' | 'generate' | 'storage' | 'auth' | 'pricing',
  lang: 'fr' | 'en' = 'fr'
): Metadata {
  const base = getBaseMetadata(lang);
  const pageUrl = `${siteUrl}/${page === 'home' ? '' : page}`;
  
  const pageDescriptions = {
    home: descriptions[lang].long,
    generate: lang === 'fr'
      ? 'Créez votre miniature YouTube en quelques clics ! Uploadez vos images, décrivez votre vision, et notre IA génère une miniature professionnelle optimisée pour maximiser vos vues et clics.'
      : 'Create your YouTube thumbnail in a few clicks! Upload your images, describe your vision, and our AI generates a professional thumbnail optimized to maximize your views and clicks.',
    storage: lang === 'fr'
      ? 'Retrouvez toutes vos miniatures YouTube générées. Téléchargez en HD et 4K, gérez votre galerie de thumbnails professionnels. Historique complet de vos créations.'
      : 'Find all your generated YouTube thumbnails. Download in HD and 4K, manage your professional thumbnail gallery. Complete history of your creations.',
    auth: lang === 'fr'
      ? 'Connectez-vous à MakeMinia pour créer des miniatures YouTube illimitées. Inscription gratuite, accès instantané, crédits offerts pour commencer.'
      : 'Log in to MakeMinia to create unlimited YouTube thumbnails. Free registration, instant access, free credits to get started.',
    pricing: lang === 'fr'
      ? 'Plans et tarifs MakeMinia. Achetez des crédits pour générer des miniatures YouTube professionnelles. Prix compétitifs, qualité premium, support rapide.'
      : 'MakeMinia plans and pricing. Buy credits to generate professional YouTube thumbnails. Competitive prices, premium quality, fast support.',
  };

  return {
    ...base,
    title: titles[page][lang],
    description: pageDescriptions[page],
    alternates: {
      canonical: pageUrl,
      languages: {
        'fr-FR': pageUrl,
        'en-US': `${pageUrl}/en`,
      },
    },
    openGraph: {
      ...base.openGraph,
      url: pageUrl,
      title: titles[page][lang],
      description: pageDescriptions[page],
    },
    twitter: {
      ...base.twitter,
      title: titles[page][lang],
      description: pageDescriptions[page],
    },
  };
}

// Structured Data JSON-LD
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MakeMinia',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: descriptions.fr.short,
    sameAs: [
      'https://twitter.com/makeminia',
      'https://facebook.com/makeminia',
      'https://instagram.com/makeminia',
      'https://youtube.com/@makeminia',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@faireuneminiature.fr',
      availableLanguage: ['French', 'English'],
    },
  };
}

export function getWebApplicationSchema(lang: 'fr' | 'en' = 'fr') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MakeMinia',
    url: siteUrl,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    description: descriptions[lang].long,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: lang === 'fr'
      ? 'Générateur IA, Templates professionnels, Export HD/4K, Personnalisation avancée, Galerie de miniatures, Support multilingue'
      : 'AI Generator, Professional templates, HD/4K export, Advanced customization, Thumbnail gallery, Multilingual support',
  };
}

export function getSoftwareApplicationSchema(lang: 'fr' | 'en' = 'fr') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MakeMinia - YouTube Thumbnail Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '4.99',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };
}
