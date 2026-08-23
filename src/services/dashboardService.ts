import { MOCK_CROPS } from '../data/crops';

const getCropImage = (id: string): string => {
  return MOCK_CROPS.find((c) => c.id === id)?.image || '';
};

export interface DashboardMetric {
  id: string;
  labelKey: string;
  value: string;
  change: string;
  changeKey?: string;
  color: string;
  route: string;
}

export interface SoilNutrientStatus {
  name: string;
  value: number; // percentage or scale
  status: 'Low' | 'Optimal' | 'High';
  statusColor: string;
  explanation: string;
  whyItMatters: string;
  recommendation: string;
}

export interface RecentAnalysisItem {
  id: string;
  cropName: string;
  field: string;
  date: string;
  fertilizer: string;
  matchScore: number;
  status: 'Active' | 'Applied' | 'Scheduled';
  image: string;
}

export interface DashboardData {
  user: {
    name: string;
    role: string;
    avatar: string;
    greetingKey: string;
  };
  metrics: DashboardMetric[];
  latestRecommendation: {
    cropName: string;
    field: string;
    matchScore: number;
    recommendedFertilizer: string;
    dosage: string;
    npk: { n: number; p: number; k: number };
    status: {
      n: string;
      p: string;
      k: string;
    };
  };
  soilHealth: {
    pH: number;
    moisture: string;
    nutrients: SoilNutrientStatus[];
  };
  recentAnalyses: RecentAnalysisItem[];
  myCrops: {
    id: string;
    name: string;
    season: string;
    image: string;
    soilType: string;
  }[];
  latestInsights: {
    id: string;
    title: string;
    category: string;
    readTime: string;
    image: string;
  }[];
}

export const getDashboardData = (): DashboardData => {
  return {
    user: {
      name: 'Dharmik',
      role: 'Precision Farmer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      greetingKey: 'dashboard.greeting',
    },
    metrics: [
      {
        id: 'analyses',
        labelKey: 'dashboard.metricAnalyses',
        value: '24',
        change: '+4 this month',
        changeKey: 'dashboard.metricAnalysesChange',
        color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
        route: '/history',
      },
      {
        id: 'recommendations',
        labelKey: 'dashboard.metricRecommendations',
        value: '18',
        change: 'Generated',
        changeKey: 'dashboard.metricRecsChange',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        route: '/history',
      },
      {
        id: 'savedCrops',
        labelKey: 'dashboard.metricSavedCrops',
        value: '8',
        change: 'In Library',
        changeKey: 'dashboard.metricCropsChange',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        route: '/crops',
      },
      {
        id: 'savedFertilizers',
        labelKey: 'dashboard.metricSavedFertilizers',
        value: '12',
        change: 'In Library',
        changeKey: 'dashboard.metricFertilizersChange',
        color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
        route: '/fertilizers',
      },
    ],
    latestRecommendation: {
      cropName: 'Wheat',
      field: 'Field #12',
      matchScore: 94,
      recommendedFertilizer: 'Neem Coated Urea + DAP Combo',
      dosage: '120 kg/ha',
      npk: { n: 45, p: 28, k: 35 },
      status: {
        n: 'Nitrogen Slightly Deficient (-15%)',
        p: 'Phosphorus Optimal Target',
        k: 'Potassium Healthy Range',
      },
    },
    soilHealth: {
      pH: 6.8,
      moisture: '24%',
      nutrients: [
        {
          name: 'Nitrogen (N)',
          value: 35,
          status: 'Low',
          statusColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
          explanation: 'Nitrogen promotes vegetative growth and lush green canopy development.',
          whyItMatters: 'Low Nitrogen causes leaf yellowing (chlorosis) and reduces crop biomass yield by up to 30%.',
          recommendation: 'Apply Neem Coated Urea split into 2 applications during early tillering.',
        },
        {
          name: 'Phosphorus (P)',
          value: 70,
          status: 'Optimal',
          statusColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
          explanation: 'Phosphorus stimulates root elongation and early seedling establishment.',
          whyItMatters: 'Optimal P levels ensure strong stem strength and disease resistance.',
          recommendation: 'Maintain current soil organic matter levels with balanced DAP basal dosing.',
        },
        {
          name: 'Potassium (K)',
          value: 65,
          status: 'Optimal',
          statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          explanation: 'Potassium regulates stomatal water loss and grain grain-filling firmness.',
          whyItMatters: 'Sufficient K prevents drought stress and enhances crop shelf life post-harvest.',
          recommendation: 'Apply MOP (Muriate of Potash) during grain formation stage.',
        },
      ],
    },
    recentAnalyses: [
      {
        id: 'rec_1',
        cropName: 'Wheat',
        field: 'North Parcel #12',
        date: '15 Aug 2026',
        fertilizer: 'Neem Coated Urea',
        matchScore: 94,
        status: 'Active',
        image: getCropImage('wheat'),
      },
      {
        id: 'rec_2',
        cropName: 'Rice (Paddy)',
        field: 'East Plot #4',
        date: '12 Aug 2026',
        fertilizer: 'NPK 10-26-26 Complex',
        matchScore: 91,
        status: 'Applied',
        image: getCropImage('rice'),
      },
      {
        id: 'rec_3',
        cropName: 'Cotton',
        field: 'South Acre #8',
        date: '08 Aug 2026',
        fertilizer: 'Urea + Single Super Phosphate',
        matchScore: 88,
        status: 'Scheduled',
        image: getCropImage('cotton'),
      },
      {
        id: 'rec_4',
        cropName: 'Maize',
        field: 'West Field #2',
        date: '04 Aug 2026',
        fertilizer: 'NPK 12-32-16 Blend',
        matchScore: 93,
        status: 'Applied',
        image: getCropImage('maize'),
      },
    ],
    myCrops: [
      {
        id: 'crop_wheat',
        name: 'Wheat',
        season: 'Rabi Season',
        soilType: 'Loam Soil',
        image: getCropImage('wheat'),
      },
      {
        id: 'crop_rice',
        name: 'Rice (Paddy)',
        season: 'Kharif Season',
        soilType: 'Clay Loam',
        image: getCropImage('rice'),
      },
      {
        id: 'crop_cotton',
        name: 'Cotton',
        season: 'Kharif Season',
        soilType: 'Black Soil',
        image: getCropImage('cotton'),
      },
      {
        id: 'crop_maize',
        name: 'Maize',
        season: 'All Seasons',
        soilType: 'Sandy Loam',
        image: getCropImage('maize'),
      },
    ],
    latestInsights: [
      {
        id: 'npk-ratios',
        title: 'How to Understand NPK Ratios for Maximum Yield',
        category: 'Soil & NPK',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'soil-ph',
        title: 'Managing Soil pH to Prevent Nutrient Lockout',
        category: 'Soil & NPK',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'over-fertilization',
        title: 'How Over-Fertilization Damages Long-Term Soil Health',
        category: 'Sustainable Farming',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
      },
    ],
  };
};
