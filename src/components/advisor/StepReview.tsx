import React from 'react';
import { Crop, SoilType } from '../../types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { MagneticButton } from '../common/MagneticButton';
import { Edit2, Sparkles, Sprout, Layers, Sliders, Thermometer, MapPin } from 'lucide-react';

interface StepReviewProps {
  crop: Crop;
  soilType: SoilType;
  pH: number;
  soilMoisture: number;
  n: number;
  p: number;
  k: number;
  temp: number;
  humidity: number;
  rainfall: number;
  fieldArea: number;
  location?: string;
  onEditStep: (step: number) => void;
  onAnalyze: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  crop,
  soilType,
  pH,
  soilMoisture,
  n,
  p,
  k,
  temp,
  humidity,
  rainfall,
  fieldArea,
  location,
  onEditStep,
  onAnalyze,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const cropName = crop.localNames[language] || crop.name;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.reviewTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          {t('advisor.reviewDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1: Crop Selection Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-3 relative bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <Sprout className="h-4 w-4" />
              <span>{t('advisor.reviewCropHeading')}</span>
            </div>
            <button
              onClick={() => onEditStep(1)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{t('advisor.btnEdit')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={crop.image}
              alt={crop.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
              }}
              className="h-14 w-14 rounded-xl object-cover border border-emerald-500/30 shrink-0"
            />
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{cropName}</h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {crop.scientificName ? <em>{crop.scientificName}</em> : crop.category} • {crop.season}
              </p>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold block">
                Target NPK: {crop.idealNPK.n}-{crop.idealNPK.p}-{crop.idealNPK.k} kg/ha
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Soil Chemistry & Moisture Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-3 relative bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
              <span>{t('advisor.reviewSoilHeading')}</span>
            </div>
            <button
              onClick={() => onEditStep(2)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{t('advisor.btnEdit')}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Soil Type</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{soilType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Soil pH</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{pH} pH</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Moisture</span>
              <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 font-mono">{soilMoisture}%</span>
            </div>
          </div>
        </div>

        {/* Step 3: NPK Nutrient Levels Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-3 relative bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <Sliders className="h-4 w-4" />
              <span>{t('advisor.reviewNutrientHeading')}</span>
            </div>
            <button
              onClick={() => onEditStep(3)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{t('advisor.btnEdit')}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="rounded-xl bg-cyan-500/10 dark:bg-[#171C19] border border-cyan-500/30 p-2">
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-extrabold uppercase block">Nitrogen (N)</span>
              <span className="text-xs font-black text-cyan-700 dark:text-cyan-400 font-mono">{n} kg/ha</span>
            </div>

            <div className="rounded-xl bg-violet-500/10 dark:bg-[#171C19] border border-violet-500/30 p-2">
              <span className="text-[10px] text-violet-700 dark:text-violet-400 font-extrabold uppercase block">Phosphorus (P)</span>
              <span className="text-xs font-black text-violet-700 dark:text-violet-400 font-mono">{p} kg/ha</span>
            </div>

            <div className="rounded-xl bg-amber-500/10 dark:bg-[#171C19] border border-amber-500/30 p-2">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase block">Potassium (K)</span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 font-mono">{k} kg/ha</span>
            </div>
          </div>
        </div>

        {/* Step 4: Environment & Field Conditions Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-3 relative bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <Thermometer className="h-4 w-4" />
              <span>{t('advisor.reviewEnvHeading')}</span>
            </div>
            <button
              onClick={() => onEditStep(4)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{t('advisor.btnEdit')}</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-1">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Temp</span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">{temp}°C</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Humidity</span>
              <span className="text-xs font-black text-blue-700 dark:text-blue-400">{humidity}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Rainfall</span>
              <span className="text-xs font-black text-cyan-700 dark:text-cyan-400">{rainfall}mm</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Area</span>
              <span className="text-xs font-black text-purple-700 dark:text-purple-300">{fieldArea}ha</span>
            </div>
          </div>

          {location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA Section */}
      <div className="pt-4 flex flex-col items-center justify-center space-y-3">
        <MagneticButton size="lg" variant="primary" onClick={onAnalyze} className="w-full sm:w-auto min-w-[280px]">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-extrabold">{t('advisor.btnAnalyze')}</span>
        </MagneticButton>
        <p className="text-xs text-slate-600 dark:text-slate-400 text-center font-medium">
          Generates instant NPK dosage, chemical solubility recommendations & alternative fertilizer matches.
        </p>
      </div>
    </div>
  );
};
