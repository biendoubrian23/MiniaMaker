// Validation des fichiers uploadés

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

/**
 * Valide qu'un fichier est une image valide
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type de fichier
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format de fichier non accepté. Utilisez PNG, JPG, JPEG ou WEBP.',
    };
  }

  // Vérifier la taille du fichier
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Le fichier est trop volumineux. Taille maximale : 10 Mo.',
    };
  }

  return { valid: true };
}

/**
 * Valide le prompt de génération
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  const trimmedPrompt = prompt.trim();

  if (trimmedPrompt.length < 10) {
    return {
      valid: false,
      error: 'Le prompt doit contenir au moins 10 caractères.',
    };
  }

  if (trimmedPrompt.length > 2000) {
    return {
      valid: false,
      error: 'Le prompt ne peut pas dépasser 2000 caractères.',
    };
  }

  return { valid: true };
}

/**
 * Convertit un fichier en base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Retourner le Data URL complet (avec préfixe)
        resolve(reader.result);
      } else {
        reject(new Error('Erreur lors de la lecture du fichier'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
