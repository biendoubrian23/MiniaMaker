// Types globaux pour l'application
export interface UploadedImage {
  file: File;
  preview: string;
  type: 'face' | 'inspiration' | 'extra';
}

export interface GenerateRequest {
  faceImageUrl: string;
  inspirationImageUrl: string;
  extraImageUrl: string;
  prompt: string;
  count: number;
}

export interface GenerateResponse {
  images: string[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
