export type LanguageCode = 'en' | 'hi' | 'gu';

export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'All-Season';
export type SoilType = 'Sandy' | 'Loamy' | 'Clay' | 'Black' | 'Red' | 'Alluvial';
export type FertilizerType = 'chemical' | 'organic' | 'bio' | 'micronutrient';
export type NutrientStatus = 'low' | 'optimal' | 'high';
export type pHStatus = 'acidic' | 'optimal' | 'alkaline';

export interface NutrientDeficiency {
  nutrient: string;
  symptoms: string;
  remedy: string;
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  localNames: Record<string, string>;
  category: 'Cereal' | 'Pulse' | 'Vegetable' | 'Cash Crop' | 'Oilseed' | 'Fruit';
  image: string;
  season: Season;
  idealSoil: SoilType[];
  idealNPK: {
    n: number;
    p: number;
    k: number;
  };
  idealpH: {
    min: number;
    max: number;
  };
  idealTemp: { min: number; max: number };
  idealHumidity: { min: number; max: number };
  idealRainfall: { min: number; max: number };
  description: string;
  growingDays: number;
  commonDeficiencies: NutrientDeficiency[];
}

export interface Fertilizer {
  id: string;
  name: string;
  localNames?: Record<string, string>;
  type: FertilizerType;
  npkRatio: string;
  composition: {
    n: number;
    p: number;
    k: number;
    others?: string;
  };
  suitableCrops: string[];
  description: string;
  dosagePerHectare: string;
  applicationMethod: string;
  bestStage: string;
  advantages: string[];
  precautions: string[];
  priceRange: string;
  image: string;
}

export interface SoilParams {
  soilType: SoilType;
  pH: number;
  n: number;
  p: number;
  k: number;
  soilMoisture?: number;
}

export interface EnvironmentalParams {
  temperature: number;
  humidity: number;
  rainfall: number;
  fieldArea?: number;
  location?: string;
}

export interface RecommendationRequest {
  cropId: string;
  soil: SoilParams;
  environment: EnvironmentalParams;
  language?: string;
}

export interface CombinedPredictionRequest {
  N?: number;
  P?: number;
  K?: number;
  temperature?: number;
  humidity?: number;
  ph?: number;
  rainfall?: number;
  Soil_Type: string;
  Soil_pH: number;
  Soil_Moisture: number;
  Organic_Carbon: number;
  Electrical_Conductivity: number;
  Nitrogen_Level: number;
  Phosphorus_Level: number;
  Potassium_Level: number;
  Temperature: number;
  Humidity: number;
  Rainfall: number;
  Crop_Type: string;
  Crop_Growth_Stage: string;
  Season: string;
  Irrigation_Type: string;
  Previous_Crop: string;
  Region: string;
  Fertilizer_Used_Last_Season: number;
  Yield_Last_Season: number;
}

export interface CombinedPredictionResponse {
  recommended_crop: string;
  crop_confidence: number;
  crop_probabilities: Record<string, number>;
  recommended_fertilizer: string;
  fertilizer_confidence: number;
  fertilizer_probabilities: Record<string, number>;
}

export interface FertilizerAlternative {
  fertilizer: Fertilizer;
  suitabilityScore: number;
  rationale: string;
}

export interface UnifiedWeatherInfo {
  status: 'available' | 'unavailable' | 'not_requested';
  message?: string | null;
  location?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  temperature?: number | null;
  feels_like?: number | null;
  humidity?: number | null;
  pressure?: number | null;
  wind_speed?: number | null;
  weather?: string | null;
  description?: string | null;
  cloudiness?: number | null;
  rainfall?: number | null;
}

export interface UnifiedAIAdvice {
  status: 'available' | 'unavailable';
  message?: string | null;
  summary: string;
  recommendation_reason: string;
  application_guidance: string;
  weather_considerations: string;
  soil_considerations: string;
  precautions: string;
  confidence_note: string;
}

export interface UnifiedRecommendationResponse {
  prediction: CombinedPredictionResponse;
  weather: UnifiedWeatherInfo;
  ai_advice: UnifiedAIAdvice;
}

export interface UnifiedRecommendationRequest extends CombinedPredictionRequest {
  location?: string;
  language?: string;
}

export interface RecommendationResult {
  id: string;
  timestamp: string;
  crop: Crop;
  soil: SoilParams;
  environment: EnvironmentalParams;
  primaryFertilizer: Fertilizer;
  recommendedDosage: string;
  applicationTiming: string;
  applicationMethod: string;
  suitabilityScore: number;
  aiExplanation: {
    summary: string;
    whyThisFertilizer: string;
    soilCorrectionTips: string[];
    riskFactors: string[];
  };
  nutrientAnalysis: {
    nStatus: NutrientStatus;
    pStatus: NutrientStatus;
    kStatus: NutrientStatus;
    phStatus: pHStatus;
    nGap: number;
    pGap: number;
    kGap: number;
  };
  alternatives: FertilizerAlternative[];
  // ML Model prediction fields
  recommended_crop?: string;
  crop_confidence?: number;
  crop_probabilities?: Record<string, number>;
  recommended_fertilizer?: string;
  fertilizer_confidence?: number;
  fertilizer_probabilities?: Record<string, number>;
  // Step 10 Unified fields
  weather?: UnifiedWeatherInfo;
  ai_advice?: UnifiedAIAdvice;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Soil Health' | 'NPK Science' | 'Organic Farming' | 'Fertilizer Guide' | 'Sustainable Agri';
  readTime: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
  link?: string;
}

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
}

export interface UserProfileData {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  farmLocation?: string;
  farmSize?: number | null;
  preferredLanguage?: string;
  updatedAt?: unknown;
}

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  farmSize: number;
  preferredLanguage: LanguageCode;
  primaryCrops: string[];
  avatar: string;
}

export interface FieldItem {
  id: string;
  name: string;
  area: number;
  unit: string;
  crop: string;
  growthStage: string;
}

export interface FarmDetails {
  farmName: string;
  totalFarmSize: number;
  unit: string;
  fields: FieldItem[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  largeTouchTargets: boolean;
}

export interface AppPreferences {
  theme: 'dark' | 'light' | 'system';
  language: LanguageCode;
  infoMode: 'simple' | 'advanced';
  accessibility: AccessibilitySettings;
}

export interface WeatherData {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  weather: string;
  description: string;
  cloudiness: number;
  rainfall?: number | null;
}

