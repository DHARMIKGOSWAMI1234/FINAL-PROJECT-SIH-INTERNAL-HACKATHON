import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Crop } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { GlassCard } from '../common/GlassCard';
import { MagneticButton } from '../common/MagneticButton';
import {
  ArrowLeft,
  Heart,
  Sprout,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Thermometer,
  Droplets,
  CloudRain,
  Clock,
  FlaskConical,
  Layers,
  PlusCircle,
} from 'lucide-react';

export interface CropDetailsProps {
  crop: Crop;
  onBack?: () => void;
  onUseCrop?: (crop: Crop) => void;
}

export const CropDetails: React.FC<CropDetailsProps> = ({
  crop,
  onBack,
  onUseCrop,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isCropFav, toggleCrop } = useFavorites();
  const { showToast } = useToast();

  const isFav = isCropFav(crop.id);
  const displayName = crop.localNames?.[language] || crop.name;

  const handleUseThisCrop = () => {
    if (onUseCrop) {
      onUseCrop(crop);
    } else {
      showToast(`Selected ${displayName} for Fertilizer Advisor analysis!`, 'success');
      navigate('/advisor', { state: { cropId: crop.id } });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/crops');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Top Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors border border-emerald-500/15"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t('cropDetail.backToCrops', 'Back to Crops Database')}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/advisor')}
            className="inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 transition-colors border border-emerald-500/15"
          >
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            <span>{t('cropDetail.startNewAnalysis', 'Start New Analysis')}</span>
          </button>
          <MagneticButton size="sm" variant="primary" onClick={handleUseThisCrop}>
            <Sparkles className="h-4 w-4" />
            <span>{t('cropDetail.useThisCrop', 'Use This Crop in Advisor')}</span>
          </MagneticButton>
        </div>
      </div>

      {/* Main Crop Hero Card */}
      <GlassCard className="border border-emerald-500/30 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Crop Media Photo */}
          <div className="lg:col-span-5 relative group">
            <div className="h-72 sm:h-80 w-full rounded-3xl overflow-hidden relative border-2 border-emerald-500/30 shadow-glow-md">
              <img
                src={crop.image}
                alt={crop.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Season Pill */}
              <span className="absolute bottom-4 left-4 rounded-xl bg-black/80 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-white border border-emerald-500/30">
                {crop.season} Season
              </span>

              {/* Favorite Button */}
              <button
                onClick={() => toggleCrop(crop.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition-transform active:scale-95 border border-white/20"
                title="Save to Favorites"
              >
                <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Crop Profile Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {crop.category}
              </span>
              <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-3.5 py-1 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                {crop.season} Crop
              </span>
              <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3.5 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-300">
                {crop.growingDays} Days Duration
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 italic mt-1 flex items-center gap-1.5">
                <Sprout className="h-4 w-4 text-emerald-500" />
                <span>{crop.scientificName}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {crop.description}
            </p>

            {/* Suitable Soils Badges */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('cropDetail.idealSoil', 'Ideal Soil Types')}
              </span>
              <div className="flex flex-wrap gap-2">
                {crop.idealSoil.map((st) => (
                  <span
                    key={st}
                    className="rounded-xl glass-panel px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 border border-emerald-500/20"
                  >
                    {st} Soil
                  </span>
                ))}
              </div>
            </div>

            {/* Prominent Action Button */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <MagneticButton size="lg" variant="primary" onClick={handleUseThisCrop}>
                <Sparkles className="h-5 w-5" />
                <span>{t('cropDetail.useThisCrop', 'Use This Crop in Advisor')}</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Ideal Growing Parameters Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-emerald-500" />
          <span>{t('cropDetail.idealParameters', 'Optimal Agronomic Parameters')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target NPK */}
          <GlassCard className="border border-emerald-500/20 p-5 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                {t('cropDetail.targetNPK', 'Target NPK Ratio')}
              </span>
              <Layers className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {crop.idealNPK.n} - {crop.idealNPK.p} - {crop.idealNPK.k}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-1">
              <span className="text-cyan-600 dark:text-cyan-400">N: {crop.idealNPK.n}</span>
              <span className="text-violet-600 dark:text-violet-400">P: {crop.idealNPK.p}</span>
              <span className="text-amber-600 dark:text-amber-400">K: {crop.idealNPK.k}</span>
            </div>
          </GlassCard>

          {/* Soil pH Window */}
          <GlassCard className="border border-amber-500/20 p-5 space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                {t('cropDetail.phWindow', 'Soil pH Window')}
              </span>
              <FlaskConical className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
              {crop.idealpH.min} - {crop.idealpH.max} pH
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Optimal Soil Chemistry Window</p>
          </GlassCard>

          {/* Temperature Range */}
          <GlassCard className="border border-blue-500/20 p-5 space-y-2 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                {t('cropDetail.idealTemp', 'Temperature Range')}
              </span>
              <Thermometer className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">
              {crop.idealTemp.min}°C - {crop.idealTemp.max}°C
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ambient Germination & Growth</p>
          </GlassCard>

          {/* Humidity & Rainfall */}
          <GlassCard className="border border-purple-500/20 p-5 space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                {t('cropDetail.growingDuration', 'Growing Season')}
              </span>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-300 font-mono tracking-tight">
              {crop.growingDays} Days
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">From Sowing to Canopy Harvest</p>
          </GlassCard>
        </div>
      </div>

      {/* Climate Requirements Sub-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard className="border border-sky-500/20 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {t('cropDetail.idealHumidity', 'Relative Humidity')}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {crop.idealHumidity.min}% - {crop.idealHumidity.max}% Relative Humidity
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border border-indigo-500/20 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <CloudRain className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {t('cropDetail.idealRainfall', 'Annual Rainfall')}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {crop.idealRainfall.min} mm - {crop.idealRainfall.max} mm Annual Rainfall
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Common Nutrient Deficiencies & Remedies */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          <span>{t('cropDetail.deficiencyTitle', 'Common Nutrient Deficiencies & Remedies')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crop.commonDeficiencies.map((def, idx) => (
            <GlassCard
              key={idx}
              className="border border-amber-500/20 p-6 space-y-3 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  {def.nutrient} Deficiency
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  Field Warning
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t('cropDetail.symptoms', 'Symptoms')}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {def.symptoms}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t('cropDetail.remedy', 'Recommended Remedy')}</span>
                </span>
                <p className="text-xs text-slate-800 dark:text-emerald-300 font-bold leading-relaxed bg-emerald-500/10 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
                  {def.remedy}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
