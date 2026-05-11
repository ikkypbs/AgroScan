export interface CropRecommendation {
  name: string;
  reason: string;
}

export interface SpatialAnalysis {
  estimatedArea: string;
  landShape: 'Persegi' | 'Trapesium' | 'Tidak Beraturan' | 'Lainnya';
  contourDescription: string;
  slopeLevel: 'Datar' | 'Landai' | 'Curam';
}

export interface LandAnalysis {
  spatialAnalysis: SpatialAnalysis;
  vegetationAnalysis: {
    weeds: { scientificName: string; commonName: string; implication: string }[];
    soilEstimation: string;
    estimatedPh: string;
    fertilityLevel: string;
  };
  processingRecommendation: {
    method: 'Manual' | 'Mekanis' | 'Kimiawi';
    instructions: string;
    toolsNeeded: string[];
    safetyNotes: string;
  };
  cropRecommendations: CropRecommendation[];
  plantingTechnique: {
    methodName: string;
    description: string;
    dimensions: {
      bedHeight: string;
      bedWidth: string;
      spacing: string;
    };
    steps: string[];
  };
}

export interface FarmerInterviewData {
  dimensions: string;
  vegetation: string;
  history: string;
  weather: string;
  waterSource: string;
  additionalNotes: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: LandAnalysis | null;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
}
