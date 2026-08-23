import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useHistory } from '../context/HistoryContext';
import { useFavorites } from '../context/FavoritesContext';
import { RecommendationResult } from '../types';
import { ApiService } from '../services/api';
import { generateFarmReportPDF } from '../services/pdfGenerator';
import { usePreferences } from '../context/PreferencesContext';
import { SuitabilityGauge } from '../components/charts/SuitabilityGauge';
import { FertilizerComparisonModal } from '../components/comparison/FertilizerComparisonModal';
import { DualModeToggle } from '../components/common/DualModeToggle';
import { GlassCard } from '../components/common/GlassCard';
import { MagneticButton } from '../components/common/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bookmark,
  Scale,
  Layers,
  ChevronRight,
  Download,
  PlusCircle,
  LayoutDashboard,
  MessageSquare,
  Thermometer,
  Droplets,
  CloudRain,
  Sliders,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const RecommendationPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { history, saveRecommendation, deleteRecommendation, isSaved } = useHistory();
  const { toggleRecommendation, isRecFav } = useFavorites();
  const { farm, infoMode } = usePreferences();
  const isSavingRef = React.useRef(false);

  const [result, setResult] = useState<RecommendationResult | null>(() => {
    const stateResult = (location.state as { result?: RecommendationResult })?.result;
    if (stateResult) return stateResult;
    if (id) {
      const match = history.find((h) => h.id === id);
      if (match) return match;
    }
    return history[0] || null;
  });

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showAdvancedInSimple, setShowAdvancedInSimple] = useState(false);

  // Sync result state when location.state or route id parameter changes
  useEffect(() => {
    const stateResult = (location.state as { result?: RecommendationResult })?.result;
    if (stateResult) {
      setResult(stateResult);
    } else if (id) {
      const match = history.find((h) => h.id === id);
      if (match) {
        setResult(match);
      }
    }
  }, [id, location.state, history]);

  // Trigger celebration confetti & fetch fallback if no result exists
  useEffect(() => {
    if (result) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669', '#3B82F6', '#F59E0B'],
      });
    } else {
      ApiService.generateRecommendation({
        cropId: 'wheat',
        soil: { soilType: 'Loamy', pH: 6.8, soilMoisture: 45, n: 45, p: 25, k: 30 },
        environment: { temperature: 28, humidity: 65, rainfall: 120, location: 'North Field' },
        language,
      }).then((rec) => {
        setResult(rec);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return (
      <div className="pt-36 pb-20 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t('recommendation.title')}...
        </p>
      </div>
    );
  }

  const { crop, soil, environment, primaryFertilizer, suitabilityScore, aiExplanation, nutrientAnalysis, alternatives } = result;

  const cropDisplayName = crop.localNames[language] || crop.name;

  const handleToggleCompare = (fertId: string) => {
    if (compareIds.includes(fertId)) {
      setCompareIds(compareIds.filter((i) => i !== fertId));
    } else if (compareIds.length < 3) {
      setCompareIds([...compareIds, fertId]);
    }
  };

  const isFavorite = result ? isRecFav(result.id) || isSaved(result.id) : false;

  const handleSave = async () => {
    if (!result || isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      if (isFavorite) {
        await Promise.all([
          toggleRecommendation(result),
          deleteRecommendation(result.id),
        ]);
        showToast(t('common.success') || 'Removed', t('recommendation.savedItemRemoved'), 'info');
      } else {
        await Promise.all([
          saveRecommendation(result),
          toggleRecommendation(result),
        ]);
        showToast(t('recommendation.savedFavorites'), t('recommendation.savedToast'));
      }
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    try {
      generateFarmReportPDF(result, farm);
      showToast('PDF Downloaded', `Saved 7-page ${cropDisplayName} Farm Report PDF!`, 'success');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Download Error', 'Could not generate PDF report. Please try again.', 'error');
    }
  };

  const handleOpenAiAssistant = () => {
    window.dispatchEvent(new CustomEvent('open-ai-assistant'));
  };

  const getStatusBadge = (status: 'low' | 'optimal' | 'high') => {
    if (status === 'low') {
      return { label: t('recommendation.low'), cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
    }
    if (status === 'high') {
      return { label: t('recommendation.high'), cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' };
    }
    return { label: t('recommendation.optimal'), cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 print:pt-4 print:pb-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 print:hidden">
          <Link to="/dashboard" className="hover:text-emerald-500 transition-colors">
            {t('recommendation.breadcrumbDashboard')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/advisor" className="hover:text-emerald-500 transition-colors">
            {t('recommendation.breadcrumbAdvisor')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('recommendation.breadcrumbCurrent')}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>{t('recommendation.officialReport')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('recommendation.title')}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
              {t('recommendation.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden shrink-0">
            <DualModeToggle />
            <button
              onClick={handleDownloadPDF}
              data-tour="top-pdf-download"
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
              title={t('recommendation.downloadPdfBtn')}
            >
              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{t('recommendation.downloadPdfBtn')}</span>
            </button>
            <button
              onClick={handleOpenAiAssistant}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-glow-sm cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t('recommendation.askAiBtn')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 dark:border-white/10 shadow-xl space-y-6 relative overflow-hidden bg-white/95 dark:bg-[#121614]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 shadow-glow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('recommendation.recommendedBadge')}</span>
            </span>
            <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-500/20">
              {environment.location ? environment.location : t('recommendation.fieldName')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {result.crop_confidence !== undefined && (
              <span className="rounded-xl bg-cyan-500/15 px-3 py-1 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
                {t('recommendation.cropConfidence', { score: result.crop_confidence })}
              </span>
            )}
            <span className="rounded-xl bg-emerald-500/15 px-3 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              {result.fertilizer_confidence !== undefined
                ? t('recommendation.fertConfidence', { score: result.fertilizer_confidence })
                : t('recommendation.matchScore', { score: suitabilityScore })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 pb-6 lg:pb-0 lg:pr-6">
            <div className="relative">
              <img
                src={crop.image}
                alt={crop.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                }}
                className="h-32 w-32 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-glow-md"
              />
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-lg bg-slate-950/90 backdrop-blur-md px-3 py-0.5 text-[11px] font-bold text-white border border-emerald-500/30 whitespace-nowrap">
                {t('recommendation.cropSeasonTag', { season: crop.season })}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{cropDisplayName}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{crop.scientificName}</p>
            </div>

            <SuitabilityGauge
              score={result.crop_confidence !== undefined ? Math.round(result.crop_confidence) : suitabilityScore}
              label={result.crop_confidence !== undefined ? t('recommendation.cropConfidence', { score: Math.round(result.crop_confidence) }) : t('recommendation.statusActive')}
            />
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('recommendation.recommendedBadge')}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {primaryFertilizer.name}
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-500/10 dark:bg-black/60 backdrop-blur-md px-4 py-2 text-center border border-emerald-500/30 shrink-0">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">
                  {t('recommendation.formulaRatio')}
                </span>
                <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  NPK {primaryFertilizer.npkRatio}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {primaryFertilizer.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl bg-emerald-500/10 dark:bg-[#171C19] p-4 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('recommendation.dosageLabel')}
                </span>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {primaryFertilizer.dosagePerHectare}
                </div>
              </div>

              <div className="rounded-2xl bg-amber-500/10 dark:bg-[#171C19] p-4 border border-amber-500/30 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('recommendation.timingLabel')}
                </span>
                <div className="text-xs font-black text-amber-700 dark:text-amber-400">
                  {primaryFertilizer.bestStage}
                </div>
              </div>

              <div className="rounded-2xl bg-blue-500/10 dark:bg-[#171C19] p-4 border border-blue-500/30 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('recommendation.methodLabel')}
                </span>
                <div className="text-xs font-black text-blue-700 dark:text-blue-400">
                  {primaryFertilizer.applicationMethod}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-500" />
            <span>{t('recommendation.npkTitle')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="border border-cyan-500/30 bg-cyan-500/5 dark:bg-[#121614] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-cyan-700 dark:text-cyan-400">
                  {t('recommendation.nName')}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  {t('recommendation.leafCanopy')}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(nutrientAnalysis.nStatus).cls}`}>
                {getStatusBadge(nutrientAnalysis.nStatus).label}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('recommendation.measuredVal')}: <strong className="text-slate-900 dark:text-white">{soil.n} kg/ha</strong>
                </span>
                <span className="text-cyan-700 dark:text-cyan-400">
                  {t('recommendation.targetVal')}: <strong>{crop.idealNPK.n} kg/ha</strong>
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (soil.n / crop.idealNPK.n) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed pt-1">
              {t('recommendation.deficitGap', { amount: Math.max(0, crop.idealNPK.n - soil.n) })}
            </p>
          </GlassCard>

          <GlassCard className="border border-violet-500/30 bg-violet-500/5 dark:bg-[#121614] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-violet-700 dark:text-violet-400">
                  {t('recommendation.pName')}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  {t('recommendation.rootBloom')}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(nutrientAnalysis.pStatus).cls}`}>
                {getStatusBadge(nutrientAnalysis.pStatus).label}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('recommendation.measuredVal')}: <strong className="text-slate-900 dark:text-white">{soil.p} kg/ha</strong>
                </span>
                <span className="text-violet-700 dark:text-violet-400">
                  {t('recommendation.targetVal')}: <strong>{crop.idealNPK.p} kg/ha</strong>
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (soil.p / crop.idealNPK.p) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed pt-1">
              {t('recommendation.deficitGap', { amount: Math.max(0, crop.idealNPK.p - soil.p) })}
            </p>
          </GlassCard>

          <GlassCard className="border border-amber-500/30 bg-amber-500/5 dark:bg-[#121614] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-amber-700 dark:text-amber-400">
                  {t('recommendation.kName')}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  {t('recommendation.pestGrain')}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getStatusBadge(nutrientAnalysis.kStatus).cls}`}>
                {getStatusBadge(nutrientAnalysis.kStatus).label}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('recommendation.measuredVal')}: <strong className="text-slate-900 dark:text-white">{soil.k} kg/ha</strong>
                </span>
                <span className="text-amber-700 dark:text-amber-400">
                  {t('recommendation.targetVal')}: <strong>{crop.idealNPK.k} kg/ha</strong>
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (soil.k / crop.idealNPK.k) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed pt-1">
              {t('recommendation.deficitGap', { amount: Math.max(0, crop.idealNPK.k - soil.k) })}
            </p>
          </GlassCard>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-500" />
          <span>{t('recommendation.fieldConditionsTitle')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassCard className="p-4 border border-emerald-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.soilTypeLabel')}
            </span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{soil.soilType}</span>
          </GlassCard>

          <GlassCard className="p-4 border border-emerald-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.phLabel')}
            </span>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
              {soil.pH} pH
            </span>
          </GlassCard>

          <GlassCard className="p-4 border border-amber-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Thermometer className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.tempLabel')}
            </span>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 font-mono">
              {environment.temperature}°C
            </span>
          </GlassCard>

          <GlassCard className="p-4 border border-blue-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.humidityLabel')}
            </span>
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 font-mono">
              {environment.humidity}%
            </span>
          </GlassCard>

          <GlassCard className="p-4 border border-cyan-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <CloudRain className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.rainfallLabel')}
            </span>
            <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 font-mono">
              {environment.rainfall} mm
            </span>
          </GlassCard>

          <GlassCard className="p-4 border border-purple-500/20 space-y-2 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Maximize2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
              {t('recommendation.fieldAreaLabel')}
            </span>
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 font-mono">
              {environment.fieldArea || 2.5} ha
            </span>
          </GlassCard>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-cyan-500" />
            <span>{t('recommendation.weatherSectionTitle')}</span>
          </h2>
          {result.weather?.status === 'available' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              {t('recommendation.liveWeatherBadge')}
            </span>
          )}
        </div>

        {result.weather?.status === 'available' ? (
          <GlassCard className="border border-cyan-500/20 p-6 bg-white/95 dark:bg-[#121614] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {t('recommendation.stationLocation')}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {result.weather.location}{result.weather.country ? `, ${result.weather.country}` : ''}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-slate-500/10 px-3 py-1 text-xs font-bold capitalize text-slate-800 dark:text-slate-200 border border-slate-500/20">
                  {result.weather.description || result.weather.weather}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.tempLabel')}</span>
                <span className="text-sm font-extrabold font-mono text-amber-700 dark:text-amber-400">{result.weather.temperature?.toFixed(1)}°C</span>
              </div>

              <div className="rounded-xl bg-orange-500/10 p-3 border border-orange-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.feelsLike')}</span>
                <span className="text-sm font-extrabold font-mono text-orange-700 dark:text-orange-400">{result.weather.feels_like?.toFixed(1)}°C</span>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 border border-blue-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.humidityLabel')}</span>
                <span className="text-sm font-extrabold font-mono text-blue-700 dark:text-blue-400">{result.weather.humidity}%</span>
              </div>

              <div className="rounded-xl bg-teal-500/10 p-3 border border-teal-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.windSpeed')}</span>
                <span className="text-sm font-extrabold font-mono text-teal-700 dark:text-teal-400">{result.weather.wind_speed} m/s</span>
              </div>

              <div className="rounded-xl bg-purple-500/10 p-3 border border-purple-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.cloudiness')}</span>
                <span className="text-sm font-extrabold font-mono text-purple-700 dark:text-purple-400">{result.weather.cloudiness ?? 0}%</span>
              </div>

              <div className="rounded-xl bg-cyan-500/10 p-3 border border-cyan-500/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('recommendation.pressure')}</span>
                <span className="text-sm font-extrabold font-mono text-cyan-700 dark:text-cyan-400">{result.weather.pressure} hPa</span>
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="border border-slate-200 dark:border-white/10 p-5 bg-white/95 dark:bg-[#121614]">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5 text-cyan-500 shrink-0" />
              <span>
                {result.weather?.message || t('recommendation.weatherUnavailable')}
              </span>
            </div>
          </GlassCard>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard className="border border-emerald-500/30 space-y-5 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {t('recommendation.whyTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('recommendation.whySubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-4 border border-cyan-500/30 shadow-sm text-slate-700 dark:text-slate-300 font-medium">
              <span className="font-extrabold text-cyan-700 dark:text-cyan-400 uppercase text-[10px] block">
                {t('recommendation.nutrientDeficitSub')}
              </span>
              <p>
                {t('recommendation.whyNContent', { soilN: soil.n, crop: cropDisplayName, targetN: crop.idealNPK.n, fertilizer: primaryFertilizer.name })}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-4 border border-violet-500/30 shadow-sm text-slate-700 dark:text-slate-300 font-medium">
              <span className="font-extrabold text-violet-700 dark:text-violet-400 uppercase text-[10px] block">
                {t('recommendation.cropMatchSub')}
              </span>
              <p>
                {t('recommendation.whyCropMatch', { category: crop.category, soilType: soil.soilType })}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-4 border border-amber-500/30 shadow-sm text-slate-700 dark:text-slate-300 font-medium">
              <span className="font-extrabold text-amber-700 dark:text-amber-400 uppercase text-[10px] block">
                {t('recommendation.dosageSub')}
              </span>
              <p>
                {t('recommendation.whyDosage', { dosage: primaryFertilizer.dosagePerHectare, temp: environment.temperature, rain: environment.rainfall })}
              </p>
            </div>
          </div>

          {aiExplanation.soilCorrectionTips && aiExplanation.soilCorrectionTips.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                {t('recommendation.soilHealthAdvice')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                {aiExplanation.soilCorrectionTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 p-3 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {result.ai_advice && result.ai_advice.status === 'available' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span>{t('recommendation.geminiTitle')}</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              {t('recommendation.aiContextBadge')}
            </span>
          </div>

          <GlassCard className="border border-emerald-500/30 p-6 sm:p-8 bg-white/95 dark:bg-[#121614] space-y-6">
            <div className="space-y-2 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 p-5 border border-emerald-500/30">
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                {t('recommendation.executiveSummary')}
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {result.ai_advice.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-5 border border-cyan-500/20 shadow-sm">
                <span className="text-[10px] font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block">
                  {t('recommendation.scientificRationale')}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.ai_advice.recommendation_reason}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-5 border border-teal-500/20 shadow-sm">
                <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                  {t('recommendation.applicationGuidance')}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.ai_advice.application_guidance}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-5 border border-blue-500/20 shadow-sm">
                <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                  {t('recommendation.weatherConsiderations')}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.ai_advice.weather_considerations}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 p-5 border border-amber-500/20 shadow-sm">
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  {t('recommendation.soilConsiderations')}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.ai_advice.soil_considerations}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-3 rounded-xl bg-rose-500/10 p-4 border border-rose-500/20">
                <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">{t('recommendation.precautions')}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{result.ai_advice.precautions}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-violet-500/10 p-4 border border-violet-500/20">
                <Info className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-violet-700 dark:text-violet-400 block">{t('recommendation.confidenceNote')}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{result.ai_advice.confidence_note}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-500" />
          <span>{t('recommendation.appGuideTitle')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 border border-emerald-500/20 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                {t('recommendation.methodLabel')}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {primaryFertilizer.applicationMethod}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed pt-1">
                Evenly distribute according to root canopy zone. Dissolve thoroughly when using fertigation methods.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                {t('recommendation.timingLabel')}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {primaryFertilizer.bestStage}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed pt-1">
                Apply in morning or late afternoon when soil moisture facilitates chemical absorption.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border border-amber-500/20 space-y-4">
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              {t('recommendation.precautionsLabel')}
            </span>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {primaryFertilizer.precautions && primaryFertilizer.precautions.length > 0 ? (
                primaryFertilizer.precautions.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))
              ) : (
                <p>Wear protective gloves. Store in a dry, ventilated area away from livestock feed and open water sources.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {alternatives && alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-500" />
              <span>{t('recommendation.alternativesTitle')}</span>
            </h2>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('recommendation.compareOption')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.slice(0, 2).map((alt) => (
              <GlassCard key={alt.fertilizer.id} className="p-5 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{alt.fertilizer.name}</h3>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      NPK {alt.fertilizer.npkRatio} • {alt.fertilizer.dosagePerHectare}
                    </span>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {t('recommendation.altMatch', { score: alt.suitabilityScore })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {alt.rationale}
                </p>

                <button
                  onClick={() => {
                    handleToggleCompare(alt.fertilizer.id);
                    setCompareModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <span>{t('recommendation.compareOption')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {(result.fertilizer_probabilities || result.crop_probabilities) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span>{t('recommendation.mlProbTitle')}</span>
            </h2>
            {infoMode === 'simple' && (
              <button
                onClick={() => setShowAdvancedInSimple(!showAdvancedInSimple)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all"
              >
                <span>{showAdvancedInSimple ? t('recommendation.hideAdvancedDetails') : t('recommendation.showAdvancedDetails')}</span>
                {showAdvancedInSimple ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>

          <AnimatePresence>
            {(infoMode === 'advanced' || showAdvancedInSimple) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden"
              >
                {result.fertilizer_probabilities && (
                  <GlassCard className="border border-emerald-500/20 space-y-4 p-6 bg-white/95 dark:bg-[#121614]">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {t('recommendation.fertProbHeading')}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {t('recommendation.fertModelTag')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(result.fertilizer_probabilities)
                        .sort(([, a], [, b]) => b - a)
                        .map(([fertName, prob]) => {
                          const isTop = fertName.toLowerCase() === (result.recommended_fertilizer || '').toLowerCase();
                          return (
                            <div key={fertName} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className={isTop ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                                  {fertName} {isTop && t('recommendation.recommendedStar')}
                                </span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{prob.toFixed(2)}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, Math.max(0, prob))}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={`h-full rounded-full ${
                                    isTop ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-400 dark:bg-slate-600'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </GlassCard>
                )}

                {result.crop_probabilities && (
                  <GlassCard className="border border-emerald-500/20 space-y-4 p-6 bg-white/95 dark:bg-[#121614]">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {t('recommendation.cropProbHeading')}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {t('recommendation.cropModelTag')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(result.crop_probabilities)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 7)
                        .map(([cropName, prob]) => {
                          const isTop = cropName.toLowerCase() === (result.recommended_crop || '').toLowerCase();
                          return (
                            <div key={cropName} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className={isTop ? 'font-black text-cyan-600 dark:text-cyan-400 capitalize' : 'text-slate-700 dark:text-slate-300 capitalize'}>
                                  {cropName} {isTop && t('recommendation.recommendedStar')}
                                </span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{prob.toFixed(2)}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, Math.max(0, prob))}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={`h-full rounded-full ${
                                    isTop ? 'bg-gradient-to-r from-cyan-500 to-blue-400' : 'bg-slate-400 dark:bg-slate-600'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="glass-panel rounded-3xl p-6 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 print:hidden"
      >
        <div className="flex flex-wrap items-center gap-3">
          <MagneticButton size="md" variant={isFavorite ? 'glass' : 'primary'} onClick={handleSave}>
            {isFavorite ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t('recommendation.savedFavorites')}</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>{t('recommendation.saveBtn')}</span>
              </>
            )}
          </MagneticButton>

          <MagneticButton size="md" variant="glass" onClick={handleDownloadPDF} data-tour="pdf-download">
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('recommendation.downloadPdfBtn')}</span>
          </MagneticButton>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <MagneticButton size="md" variant="glass" onClick={() => navigate('/advisor')}>
            <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('recommendation.backAdvisorBtn')}</span>
          </MagneticButton>

          <MagneticButton size="md" variant="glass" onClick={() => navigate('/advisor')}>
            <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('recommendation.newRecBtn')}</span>
          </MagneticButton>

          <MagneticButton size="md" variant="glass" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('recommendation.backDashboardBtn')}</span>
          </MagneticButton>
        </div>
      </motion.div>

      <FertilizerComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        selectedFertilizerIds={compareIds.length > 0 ? compareIds : [primaryFertilizer.id, alternatives[0]?.fertilizer?.id || primaryFertilizer.id]}
        onToggleFertilizer={handleToggleCompare}
      />
    </div>
  );
};
