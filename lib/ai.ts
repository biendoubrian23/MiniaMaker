// Intégration avec Gemini API pour la génération d'images
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY n\'est pas défini dans les variables d\'environnement');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Génère des miniatures à partir des images et du prompt fournis
 */
export async function generateThumbnails(
  faceImageBase64: string,
  inspirationImageBase64: string,
  extraImageBase64: string,
  prompt: string,
  count: number = 2
): Promise<string[]> {
  try {
    // Utiliser le modèle spécifié : gemini-3-pro-image-preview
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

    // Construire le prompt enrichi avec les instructions
    const enrichedPrompt = `
Génère une miniature (thumbnail) créative pour YouTube en suivant ces instructions :

IMAGES FOURNIES :
- Image du visage : à intégrer dans la composition
- Image d'inspiration : pour le style et l'ambiance générale
- Image extra : élément additionnel à incorporer (objet, outil, symbole)

DESCRIPTION :
${prompt}

CONSIGNES :
- Crée une composition visuellement impactante
- Intègre harmonieusement les trois images
- Style moderne et professionnel
- Format 16:9 optimisé pour thumbnail YouTube
- Haute qualité visuelle
    `.trim();

    const images = [
      {
        inlineData: {
          data: faceImageBase64,
          mimeType: 'image/jpeg',
        },
      },
      {
        inlineData: {
          data: inspirationImageBase64,
          mimeType: 'image/jpeg',
        },
      },
      {
        inlineData: {
          data: extraImageBase64,
          mimeType: 'image/jpeg',
        },
      },
    ];

    // Générer les images
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const result = await model.generateContent([enrichedPrompt, ...images]);
      const response = await result.response;
      const text = response.text();

      // Pour l'instant, stocker la réponse (à adapter selon le vrai format de retour de Gemini)
      // Note : Gemini pourrait retourner des URLs ou des données d'image
      results.push(text);
    }

    return results;
  } catch (error) {
    console.error('Erreur lors de la génération des miniatures:', error);
    throw new Error('Échec de la génération des miniatures');
  }
}

/**
 * Vérifie que l'API Gemini est accessible
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
    // Test simple
    await model.generateContent('test');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à Gemini:', error);
    return false;
  }
}
