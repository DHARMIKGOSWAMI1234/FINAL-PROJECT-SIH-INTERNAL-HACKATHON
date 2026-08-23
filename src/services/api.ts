import { MOCK_CROPS } from '../data/crops';
import { MOCK_FERTILIZERS } from '../data/fertilizers';
import { MOCK_ARTICLES } from '../data/articles';
import {
  Crop,
  Fertilizer,
  Article,
  RecommendationRequest,
  RecommendationResult,
  NutrientStatus,
  pHStatus,
  CombinedPredictionRequest,
  CombinedPredictionResponse,
  FertilizerAlternative,
  WeatherData,
  UnifiedRecommendationRequest,
  UnifiedRecommendationResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Utility delay for fallback simulations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Finds matching Fertilizer from MOCK_FERTILIZERS by predicted name
 */
export function mapPredictedFertilizer(predictedName: string): Fertilizer {
  const norm = (predictedName || '').toLowerCase().trim();

  if (norm.includes('urea')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'urea') || MOCK_FERTILIZERS[0];
  }
  if (norm.includes('dap')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'dap') || MOCK_FERTILIZERS[1];
  }
  if (norm.includes('mop') || norm.includes('potash')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'mop') || MOCK_FERTILIZERS[2];
  }
  if (norm.includes('ssp') || norm.includes('super phosphate')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'ssp') || MOCK_FERTILIZERS[3];
  }
  if (norm.includes('compost') || norm.includes('vermicompost')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'vermicompost') || MOCK_FERTILIZERS[0];
  }
  if (norm.includes('zinc') || norm.includes('sulphate') || norm.includes('sulfate')) {
    return MOCK_FERTILIZERS.find((f) => f.id === 'zinc-sulfate') || MOCK_FERTILIZERS[0];
  }
  if (norm.includes('npk')) {
    return (
      MOCK_FERTILIZERS.find((f) => f.id === 'npk-10-26-26') ||
      MOCK_FERTILIZERS.find((f) => f.id.includes('npk')) ||
      MOCK_FERTILIZERS[0]
    );
  }

  // Exact or partial name match
  const match = MOCK_FERTILIZERS.find((f) => f.name.toLowerCase().includes(norm));
  if (match) return match;

  return MOCK_FERTILIZERS[0];
}

/**
 * Finds matching Crop from MOCK_CROPS by predicted crop name
 * Supports all 22 ML model classes:
 * apple, banana, blackgram, chickpea, coconut, coffee, cotton, grapes, jute,
 * kidneybeans, lentil, maize, mango, mothbeans, mungbean, muskmelon, orange,
 * papaya, pigeonpeas, pomegranate, rice, watermelon
 */
export function mapPredictedCrop(predictedCropName: string, fallbackCrop?: Crop): Crop {
  const raw = (predictedCropName || '').trim();
  const norm = raw.toLowerCase().replace(/[\s_-]/g, '');

  // Exact or normalized ID search
  let match = MOCK_CROPS.find((c) => c.id.toLowerCase().replace(/[\s_-]/g, '') === norm);

  // Exact or normalized Name search
  if (!match) {
    match = MOCK_CROPS.find((c) => {
      const cNorm = c.name.toLowerCase().replace(/[\s_-]/g, '');
      return cNorm.includes(norm) || norm.includes(cNorm);
    });
  }

  // Specific alias mappings
  if (!match) {
    if (norm === 'coffee') match = MOCK_CROPS.find((c) => c.id === 'coffee');
    else if (norm === 'rice' || norm.includes('paddy')) match = MOCK_CROPS.find((c) => c.id === 'rice');
    else if (norm === 'pigeonpeas' || norm === 'pigeonpea' || norm.includes('arhar') || norm.includes('tuver')) {
      match = MOCK_CROPS.find((c) => c.id === 'pigeonpea' || c.id === 'pigeonpeas');
    } else if (norm === 'kidneybeans' || norm === 'kidneybean' || norm.includes('rajma')) {
      match = MOCK_CROPS.find((c) => c.id === 'kidneybeans');
    } else if (norm === 'mothbeans' || norm === 'mothbean' || norm.includes('matki')) {
      match = MOCK_CROPS.find((c) => c.id === 'mothbeans');
    } else if (norm === 'mungbean' || norm === 'mungbeans' || norm.includes('moong')) {
      match = MOCK_CROPS.find((c) => c.id === 'mungbean');
    } else if (norm === 'blackgram' || norm.includes('urad')) {
      match = MOCK_CROPS.find((c) => c.id === 'blackgram');
    } else if (norm === 'chickpea' || norm.includes('gram')) {
      match = MOCK_CROPS.find((c) => c.id === 'chickpea');
    } else if (norm === 'muskmelon') {
      match = MOCK_CROPS.find((c) => c.id === 'muskmelon');
    } else if (norm === 'watermelon') {
      match = MOCK_CROPS.find((c) => c.id === 'watermelon');
    } else if (norm === 'pomegranate') {
      match = MOCK_CROPS.find((c) => c.id === 'pomegranate');
    }
  }

  if (match) return match;
  if (fallbackCrop) return fallbackCrop;

  const formattedName = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Crop';
  return {
    id: norm || 'crop',
    name: formattedName,
    scientificName: formattedName,
    localNames: {
      en: formattedName,
      hi: formattedName,
      gu: formattedName,
    },
    category: 'Cash Crop',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    season: 'All-Season',
    idealSoil: ['Loamy', 'Alluvial'],
    idealNPK: { n: 100, p: 50, k: 50 },
    idealpH: { min: 6.0, max: 7.5 },
    idealTemp: { min: 18, max: 32 },
    idealHumidity: { min: 50, max: 80 },
    idealRainfall: { min: 100, max: 200 },
    growingDays: 120,
    description: `${formattedName} recommended by AGRISENSE AI Model based on soil and climate conditions.`,
    commonDeficiencies: [],
  };
}

export const ApiService = {
  /**
   * Directly call the unified FastAPI backend POST /predict endpoint
   */
  async predictCombined(req: CombinedPredictionRequest): Promise<CombinedPredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      let errorMsg = `FastAPI backend returned HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) {
          if (typeof errorJson.detail === 'string') {
            errorMsg = errorJson.detail;
          } else if (Array.isArray(errorJson.detail)) {
            errorMsg = errorJson.detail
              .map((d: { msg?: string; loc?: string[] }) => d.msg || JSON.stringify(d))
              .join('; ');
          }
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  },

  async getCrops(): Promise<Crop[]> {
    await delay(50);
    return MOCK_CROPS;
  },

  async getCrop(id: string): Promise<Crop | undefined> {
    await delay(50);
    return MOCK_CROPS.find((c) => c.id === id);
  },

  async getFertilizers(): Promise<Fertilizer[]> {
    await delay(50);
    return MOCK_FERTILIZERS;
  },

  async getFertilizer(id: string): Promise<Fertilizer | undefined> {
    await delay(50);
    return MOCK_FERTILIZERS.find((f) => f.id === id);
  },

  async getArticles(): Promise<Article[]> {
    await delay(50);
    return MOCK_ARTICLES;
  },

  async getArticle(id: string): Promise<Article | undefined> {
    await delay(50);
    return MOCK_ARTICLES.find((a) => a.id === id);
  },

  /**
   * Generates AI recommendation by connecting to FastAPI backend POST /predict
   */
  async generateRecommendation(req: RecommendationRequest): Promise<RecommendationResult> {
    const selectedCrop = MOCK_CROPS.find((c) => c.id === req.cropId) || MOCK_CROPS[0];
    const { n, p, k, pH, soilMoisture, soilType } = req.soil;
    const { temperature, humidity, rainfall, location } = req.environment;

    // Map UI SoilType to ML model Soil_Type category: Clay, Silt, Sandy, Loamy
    const soilTypeMap: Record<string, string> = {
      Clay: 'Clay',
      Black: 'Clay',
      Sandy: 'Sandy',
      Loamy: 'Loamy',
      Alluvial: 'Loamy',
      Red: 'Loamy',
      Silt: 'Silt',
    };
    const mappedSoilType = soilTypeMap[soilType] || 'Loamy';

    // Map Crop Name to ML model Crop_Type: Cotton, Maize, Wheat, Potato, Rice, Sugarcane, Tomato
    const cNameLower = selectedCrop.name.toLowerCase();
    let mappedCropType = 'Wheat';
    if (cNameLower.includes('rice') || cNameLower.includes('paddy')) mappedCropType = 'Rice';
    else if (cNameLower.includes('cotton')) mappedCropType = 'Cotton';
    else if (cNameLower.includes('maize') || cNameLower.includes('corn')) mappedCropType = 'Maize';
    else if (cNameLower.includes('potato')) mappedCropType = 'Potato';
    else if (cNameLower.includes('tomato')) mappedCropType = 'Tomato';
    else if (cNameLower.includes('sugarcane')) mappedCropType = 'Sugarcane';
    else if (cNameLower.includes('wheat')) mappedCropType = 'Wheat';
    else mappedCropType = 'Wheat';

    // Construct the UnifiedRecommendationRequest required by FastAPI POST /recommendation
    const unifiedPayload: UnifiedRecommendationRequest = {
      N: Number(n),
      P: Number(p),
      K: Number(k),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(pH),
      rainfall: Number(rainfall),
      Soil_Type: mappedSoilType,
      Soil_pH: Number(pH),
      Soil_Moisture: soilMoisture !== undefined ? Number(soilMoisture) : 35.0,
      Organic_Carbon: 0.8,
      Electrical_Conductivity: 1.5,
      Nitrogen_Level: Number(n),
      Phosphorus_Level: Number(p),
      Potassium_Level: Number(k),
      Temperature: Number(temperature),
      Humidity: Number(humidity),
      Rainfall: Number(rainfall),
      Crop_Type: mappedCropType,
      Crop_Growth_Stage: 'Vegetative',
      Season: selectedCrop.season === 'Kharif' || selectedCrop.season === 'Rabi' || selectedCrop.season === 'Zaid' ? selectedCrop.season : 'Rabi',
      Irrigation_Type: 'Drip',
      Previous_Crop: mappedCropType === 'Wheat' ? 'Rice' : 'Wheat',
      Region: location && location.trim() ? location : 'North',
      Fertilizer_Used_Last_Season: 100.0,
      Yield_Last_Season: 2500.0,
      location: location && location.trim() ? location.trim() : undefined,
      language: req.language && req.language.trim() ? req.language.trim() : 'en',
    };

    // Call FastAPI backend POST /recommendation
    let unifiedResponse: UnifiedRecommendationResponse;
    try {
      unifiedResponse = await this.getUnifiedRecommendation(unifiedPayload);
    } catch (err: unknown) {
      console.warn('Unified /recommendation call failed, attempting fallback to /predict...', err);
      const fallbackPrediction = await this.predictCombined(unifiedPayload);
      unifiedResponse = {
        prediction: fallbackPrediction,
        weather: {
          status: 'unavailable',
          message: 'Live weather service temporarily unavailable.',
        },
        ai_advice: {
          status: 'unavailable',
          message: 'AI agricultural advisory service temporarily unavailable.',
          summary: `Precision recommendation for ${fallbackPrediction.recommended_crop} using ${fallbackPrediction.recommended_fertilizer}.`,
          recommendation_reason: `ML model predicted ${fallbackPrediction.recommended_fertilizer} (${fallbackPrediction.fertilizer_confidence}%) and ${fallbackPrediction.recommended_crop} (${fallbackPrediction.crop_confidence}%).`,
          application_guidance: 'Apply in split dosages suited for your current growth stage.',
          weather_considerations: 'Monitor ambient temperature and rainfall prior to application.',
          soil_considerations: `Soil pH (${pH}) should be maintained for optimal nutrient absorption.`,
          precautions: 'Follow standard fertilizer safety precautions.',
          confidence_note: `Prediction generated with ${fallbackPrediction.fertilizer_confidence}% confidence.`,
        },
      };
    }

    const aiPrediction = unifiedResponse.prediction;

    // Map AI prediction outputs - ALWAYS use backend response for recommended crop & fertilizer
    const recommendedCropObj = mapPredictedCrop(aiPrediction.recommended_crop, selectedCrop);
    const primaryFertilizer = mapPredictedFertilizer(aiPrediction.recommended_fertilizer);

    // Calculate NPK status & deficits based on the recommended crop's nutritional needs
    const nGap = recommendedCropObj.idealNPK.n - n;
    const pGap = recommendedCropObj.idealNPK.p - p;
    const kGap = recommendedCropObj.idealNPK.k - k;

    const getNStatus = (val: number, ideal: number): NutrientStatus => {
      if (val < ideal * 0.7) return 'low';
      if (val > ideal * 1.3) return 'high';
      return 'optimal';
    };

    const nStatus = getNStatus(n, recommendedCropObj.idealNPK.n);
    const pStatus = getNStatus(p, recommendedCropObj.idealNPK.p);
    const kStatus = getNStatus(k, recommendedCropObj.idealNPK.k);

    const phStatus: pHStatus =
      pH < recommendedCropObj.idealpH.min
        ? 'acidic'
        : pH > recommendedCropObj.idealpH.max
        ? 'alkaline'
        : 'optimal';

    // Build alternative fertilizers from actual ML prediction probabilities
    const sortedFertProbEntries = Object.entries(aiPrediction.fertilizer_probabilities || {})
      .filter(([name]) => name.toLowerCase() !== aiPrediction.recommended_fertilizer.toLowerCase())
      .sort((a, b) => b[1] - a[1]);

    const alternatives: FertilizerAlternative[] = sortedFertProbEntries.slice(0, 3).map(([fertName, prob]) => {
      const altFert = mapPredictedFertilizer(fertName);
      return {
        fertilizer: altFert,
        suitabilityScore: Math.round(prob),
        rationale: `Alternative option (${fertName}) with ${prob.toFixed(2)}% probability confidence from the AGRISENSE ML model.`,
      };
    });

    const suitabilityScore = Math.round(aiPrediction.fertilizer_confidence || 85);

    const result: RecommendationResult = {
      id: `rec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      crop: recommendedCropObj, // <-- ML MODEL RECOMMENDED CROP
      soil: req.soil,
      environment: req.environment,
      primaryFertilizer,
      recommendedDosage: primaryFertilizer.dosagePerHectare,
      applicationTiming: primaryFertilizer.bestStage,
      applicationMethod: primaryFertilizer.applicationMethod,
      suitabilityScore,
      aiExplanation: {
        summary: unifiedResponse.ai_advice?.summary || `AGRISENSE ML Recommendation: ${aiPrediction.recommended_fertilizer} (${aiPrediction.fertilizer_confidence}% confidence) for recommended crop ${recommendedCropObj.name} (${aiPrediction.crop_confidence}% confidence).`,
        whyThisFertilizer: unifiedResponse.ai_advice?.recommendation_reason || `Your soil test reveals ${n} kg/ha Nitrogen, ${p} kg/ha Phosphorus, and ${k} kg/ha Potassium at pH ${pH}. The trained Random Forest model predicts ${aiPrediction.recommended_fertilizer} as the optimal fertilizer with ${aiPrediction.fertilizer_confidence}% confidence and ${recommendedCropObj.name} as the best suited crop with ${aiPrediction.crop_confidence}% confidence.`,
        soilCorrectionTips: [
          phStatus === 'acidic'
            ? 'Soil is acidic (pH < 6.0): Apply Agricultural Lime during land preparation.'
            : phStatus === 'alkaline'
            ? 'Soil is alkaline (pH > 7.5): Apply Gypsum or organic Vermicompost to unlock fixed phosphorus.'
            : 'Soil pH is in the optimal range for maximum chemical absorption.',
          'Split nitrogen application into 2-3 top dressings to minimize leaching.',
          'Incorporate organic compost to enhance soil organic carbon and micro-flora.',
        ],
        riskFactors: [
          'Avoid broadcasting fertilizers directly on flooded ground or dry cracked soil.',
          'Ensure sufficient soil moisture before top-dressing.',
        ],
      },
      nutrientAnalysis: {
        nStatus,
        pStatus,
        kStatus,
        phStatus,
        nGap,
        pGap,
        kGap,
      },
      alternatives,
      // Real ML Model prediction fields
      recommended_crop: aiPrediction.recommended_crop,
      crop_confidence: aiPrediction.crop_confidence,
      crop_probabilities: aiPrediction.crop_probabilities,
      recommended_fertilizer: aiPrediction.recommended_fertilizer,
      fertilizer_confidence: aiPrediction.fertilizer_confidence,
      fertilizer_probabilities: aiPrediction.fertilizer_probabilities,
      // Real Weather & AI Advisory fields from unified pipeline
      weather: unifiedResponse.weather,
      ai_advice: unifiedResponse.ai_advice,
    };

    return result;
  },

  /**
   * Calls the unified AGRISENSE recommendation endpoint on FastAPI
   * POST /recommendation
   */
  async getUnifiedRecommendation(
    payload: UnifiedRecommendationRequest
  ): Promise<UnifiedRecommendationResponse> {
    const response = await fetch(`${API_BASE_URL}/recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const detail =
        errData.detail || `Unified recommendation failed with status ${response.status}`;
      throw new Error(detail);
    }

    return (await response.json()) as UnifiedRecommendationResponse;
  },

  async sendAIMessage(query: string, lang: string): Promise<string> {
    await delay(300);
    const q = query.toLowerCase();

    if (q.includes('wheat') || q.includes('गेहूं') || q.includes('ઘઉં')) {
      return lang === 'hi'
        ? 'गेहूं के लिए डीएपी (DAP) बुवाई के समय आधार खुराक के रूप में 100-125 किग्रा/हेक्टेयर डालें, और कल्ले निकलते समय यूरिया की पहली शीर्ष खुराक दें।'
        : lang === 'gu'
        ? 'ઘઉં માટે વાવણી વખતે ડીએપી (DAP) પાયાના ખાતર તરીકે 100-125 કગ્રા/હેક્ટર આપો અને ફૂટ થવાના સમયે યુરિયાનો પ્રથમ હપ્તો આપો.'
        : 'For Wheat, apply DAP (18-46-0) at 100-125 kg/ha as basal dosage during sowing, followed by split Urea top-dressing during the tillering stage.';
    }

    if (q.includes('npk') || q.includes('ph')) {
      return lang === 'hi'
        ? 'NPK का अर्थ है नाइट्रोजन (N), फास्फोरस (P) और पोटेशियम (K)। मिट्टी का pH 6.0 से 7.2 के बीच होने पर पौधे पोषक तत्वों को सबसे अच्छी तरह सोखते हैं।'
        : lang === 'gu'
        ? 'NPK નો અર્થ નાઇટ્રોજન (N), ફોસ્ફરસ (P) અને પોટાશ (K) થાય છે. જમીનનું pH 6.0 થી 7.2 ની વચ્ચે હોય ત્યારે છોડ તત્વો સૌથી વધુ શોષી શકે છે.'
        : 'NPK stands for Nitrogen, Phosphorus, and Potassium. A soil pH between 6.0 and 7.2 allows plant roots to absorb these nutrients with maximum chemical efficiency.';
    }

    if (q.includes('urea') || q.includes('यूरिया') || q.includes('યુરિયા')) {
      return lang === 'hi'
        ? 'नीम कोटेड यूरिया में 46% नाइट्रोजन होता है। इसे हमेशा 2-3 किश्तों में डालें और शाम के समय या नमी वाले खेत में प्रयोग करें।'
        : lang === 'gu'
        ? 'લીમડાના પડ વાળા યુરિયામાં 46% નાઇટ્રોજન હોય છે. તેને હંમેશા 2-3 હપ્તામાં આપવું અને સાંજના સમયે અથવા ભેજવાળા ખેતરમાં વાપરવું.'
        : 'Neem Coated Urea contains 46% Nitrogen. Always split the dose into 2-3 applications to prevent nitrogen leaching loss into groundwater.';
    }

    return lang === 'hi'
      ? 'AGRISENSE में आपका स्वागत है! मैं आपकी फसल, मिट्टी के प्रकार, pH और सही खाद की मात्रा से जुड़े किसी भी सवाल का जवाब दे सकता हूँ।'
      : lang === 'gu'
      ? 'AGRISENSE માં આપનું સ્વાગત છે! હું તમારા પાક, જમીનનો પ્રકાર, pH અને ખાતરની ચોક્કસ માત્રા અંગેના પ્રશ્નોના જવાબ આપી શકું છું.'
      : 'Welcome to AGRISENSE! I can answer questions regarding crop nutrient requirements, soil pH correction, NPK calculations, and fertilizer selection.';
  },

  /**
   * Fetches real-time weather metrics from FastAPI backend
   * Architecture: React -> FastAPI -> OpenWeather
   */
  async getWeatherData(location: string): Promise<WeatherData> {
    const url = `${API_BASE_URL}/weather?location=${encodeURIComponent(location.trim())}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const detail = errData.detail || `Weather request failed with status ${response.status}`;
      throw new Error(detail);
    }

    return (await response.json()) as WeatherData;
  },
};
