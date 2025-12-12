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
  model?: 'flash' | 'pro';
}

export interface GenerateResponse {
  images: string[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface CompactAnalysis {
  style: string;
  colors: string[];
  composition: string;
  extra: string;
}
