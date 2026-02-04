
export type Language = 'Tamil' | 'English' | 'Hindi' | 'Malayalam' | 'Telugu';

export type Classification = 'AI_GENERATED' | 'HUMAN';

export interface DetectionRequest {
  language: Language;
  audioFormat: string;
  audioBase64: string;
  mimeType: string;
}

export interface DetectionResponse {
  status: 'success' | 'error';
  language?: Language;
  classification?: Classification;
  confidenceScore?: number;
  explanation?: string;
  message?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: DetectionRequest;
  response: DetectionResponse;
}
