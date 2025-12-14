// Hook personnalisé pour les traductions
import { useLanguage } from '@/contexts/LanguageContext';
import { fr } from '@/locales/fr';
import { en } from '@/locales/en';
import type { TranslationKey } from '@/locales/fr';

const translations = { fr, en };

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;

    // Remplacer les paramètres {param} dans le texte
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }

    return text;
  };

  return { t, language };
}
