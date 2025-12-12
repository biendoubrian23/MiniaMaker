// Intégration avec Gemini API (Nano Banana) pour la génération d'images
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY n\'est pas défini dans les variables d\'environnement');
}

const ai = new GoogleGenAI({ apiKey });

function parseDataUrl(dataUrl: string) {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    // Si ce n'est pas une data URL, on suppose que c'est du base64 brut (fallback)
    // et on devine le mime type ou on met jpeg par défaut
    return { mimeType: 'image/jpeg', data: dataUrl };
  }
  return { mimeType: matches[1], data: matches[2] };
}

/**
 * Génère des miniatures à partir des images et du prompt fournis
 * Utilise gemini-3-pro-image-preview (Nano Banana)
 */
export async function generateThumbnails(
  faceImageBase64: string,
  inspirationImageBase64: string,
  extraImageBase64: string,
  prompt: string,
  count: number = 2,
  useProModel: boolean = false
): Promise<string[]> {
  try {
    const model = 'gemini-3-pro-image-preview';
    
    // Prompt ultra-compact pour générer l'image
    const finalPrompt = `Create YouTube thumbnail 16:9. Include face, style reference, and object. ${prompt}`;

    const face = parseDataUrl(faceImageBase64);
    const inspiration = parseDataUrl(inspirationImageBase64);
    const extra = parseDataUrl(extraImageBase64);

    const contents = [
      {
        role: 'user',
        parts: [
          { text: finalPrompt },
          { inlineData: { mimeType: face.mimeType, data: face.data } },
          { inlineData: { mimeType: inspiration.mimeType, data: inspiration.data } },
          { inlineData: { mimeType: extra.mimeType, data: extra.data } },
        ],
      },
    ];

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const results: string[] = [];

    // Générer le nombre d'images demandé
    for (let i = 0; i < count; i++) {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      // Collecter les chunks d'image
      for await (const chunk of response) {
        const candidates = chunk.candidates;
        if (candidates && candidates.length > 0) {
            const parts = candidates[0].content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData && part.inlineData.data) {
                        const mimeType = part.inlineData.mimeType || 'image/png';
                        const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
                        results.push(dataUrl);
                    }
                }
            }
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Erreur lors de la génération des miniatures:', error);
    throw error;
  }
}

/**
 * Vérifie que l'API Gemini est accessible
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    // On utilise un modèle standard pour le test de connexion
    const model = 'gemini-1.5-flash';
    await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: 'test' }] }],
    });
    return true;
  } catch (error) {
    console.error('Erreur de connexion à Gemini:', error);
    return false;
  }
}
