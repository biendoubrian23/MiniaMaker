import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.faireuneminiature.fr';
  const currentDate = new Date();
  
  return [
    // Page d'accueil - Priorité maximale
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          fr: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    // Page de création - Très haute priorité
    {
      url: `${baseUrl}/dashboard/workspace`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
      alternates: {
        languages: {
          fr: `${baseUrl}/dashboard/workspace`,
          en: `${baseUrl}/en/dashboard/workspace`,
        },
      },
    },
    // Page generate (fonctionnalité principale)
    {
      url: `${baseUrl}/generate`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/generate`,
          en: `${baseUrl}/en/generate`,
        },
      },
    },
    // Page tarifs - Haute priorité
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${baseUrl}/pricing`,
          en: `${baseUrl}/en/pricing`,
        },
      },
    },
    // Page connexion
    {
      url: `${baseUrl}/auth`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${baseUrl}/auth`,
          en: `${baseUrl}/en/auth`,
        },
      },
    },
    // Page stockage/galerie
    {
      url: `${baseUrl}/storage`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
      alternates: {
        languages: {
          fr: `${baseUrl}/storage`,
          en: `${baseUrl}/en/storage`,
        },
      },
    },
    // Dashboard stockage
    {
      url: `${baseUrl}/dashboard/storage`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${baseUrl}/dashboard/storage`,
          en: `${baseUrl}/en/dashboard/storage`,
        },
      },
    },
    // Dashboard pricing
    {
      url: `${baseUrl}/dashboard/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${baseUrl}/dashboard/pricing`,
          en: `${baseUrl}/en/dashboard/pricing`,
        },
      },
    },
    // Politique de confidentialité
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          fr: `${baseUrl}/privacy-policy`,
          en: `${baseUrl}/en/privacy-policy`,
        },
      },
    },
    // Conditions d'utilisation
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          fr: `${baseUrl}/terms-of-service`,
          en: `${baseUrl}/en/terms-of-service`,
        },
      },
    },
  ];
}
