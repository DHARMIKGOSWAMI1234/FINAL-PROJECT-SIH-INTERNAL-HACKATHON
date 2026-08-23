import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { MOCK_FERTILIZERS } from '../data/fertilizers';
import { Fertilizer } from '../types';
import {
  Search,
  FlaskConical,
  Heart,
  Scale,
  ArrowRight,
  Filter,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { FertilizerComparisonModal } from '../components/comparison/FertilizerComparisonModal';
import { MagneticButton } from '../components/common/MagneticButton';
import { motion, AnimatePresence } from 'framer-motion';

export const FertilizersPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isFertFav, toggleFertilizer } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedNutrient, setSelectedNutrient] = useState<string>('All');
  const [selectedNPKFilter, setSelectedNPKFilter] = useState<string>('All');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedFertilizerForDetails, setSelectedFertilizerForDetails] = useState<Fertilizer | null>(null);

  const types = ['All', 'chemical', 'organic', 'bio', 'micronutrient'];

  const filteredFertilizers = useMemo(() => {
    return MOCK_FERTILIZERS.filter((fert) => {
      const fertName = fert.localNames?.[language] || fert.name;
      const matchesSearch =
        searchQuery === '' ||
        fertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fert.npkRatio.includes(searchQuery) ||
        fert.suitableCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fert.composition.others && fert.composition.others.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || fert.type === selectedType;

      const matchesNutrient =
        selectedNutrient === 'All' ||
        (selectedNutrient === 'N' && fert.composition.n > 0) ||
        (selectedNutrient === 'P' && fert.composition.p > 0) ||
        (selectedNutrient === 'K' && fert.composition.k > 0) ||
        (selectedNutrient === 'Micronutrient' && (fert.type === 'micronutrient' || Boolean(fert.composition.others)));

      const matchesNPK =
        selectedNPKFilter === 'All' ||
        (selectedNPKFilter === 'high-n' && fert.composition.n >= 30) ||
        (selectedNPKFilter === 'high-p' && fert.composition.p >= 20) ||
        (selectedNPKFilter === 'high-k' && fert.composition.k >= 20) ||
        (selectedNPKFilter === 'complex' && fert.composition.n > 0 && fert.composition.p > 0 && fert.composition.k > 0);

      return matchesSearch && matchesType && matchesNutrient && matchesNPK;
    });
  }, [searchQuery, selectedType, selectedNutrient, selectedNPKFilter, language]);

  const handleToggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((i) => i !== id));
    } else if (compareIds.length < 3) {
      setCompareIds([...compareIds, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedNutrient('All');
    setSelectedNPKFilter('All');
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <FlaskConical className="h-3.5 w-3.5" />
          <span>Agricultural Fertilizer Database ({MOCK_FERTILIZERS.length} Formulations)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('fertilizers.title', 'Fertilizer Information Library')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          {t('fertilizers.subtitle', 'Explore NPK ratios, composition chemical formulas, application dosages, and crop suitability across all major agricultural fertilizers.')}
        </p>
      </div>

      {/* Floating Comparison Action Bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="glass-panel fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full px-6 py-3 border border-emerald-500/40 shadow-2xl flex items-center gap-4 bg-slate-900/90 text-white backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <Scale className="h-4 w-4 text-emerald-400" />
              <span>{compareIds.length} of 3 Selected</span>
            </div>
            <MagneticButton size="sm" variant="primary" onClick={() => setCompareModalOpen(true)}>
              <span>Compare Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </MagneticButton>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-400 hover:text-white underline ml-1 cursor-pointer"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Comprehensive Filters Toolbar */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20 dark:border-white/10 bg-white/90 dark:bg-[#121614] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('fertilizers.searchPlaceholder', 'Search by name, NPK, crop or nutrient...')}
              className="w-full glass-panel rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Primary Nutrient Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedNutrient}
              onChange={(e) => setSelectedNutrient(e.target.value)}
              className="w-full glass-panel rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Primary Nutrients</option>
              <option value="N">Nitrogen Rich (N)</option>
              <option value="P">Phosphorus Rich (P)</option>
              <option value="K">Potassium Rich (K)</option>
              <option value="Micronutrient">Micronutrient & Secondary</option>
            </select>
          </div>

          {/* NPK Ratio Filter Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedNPKFilter}
              onChange={(e) => setSelectedNPKFilter(e.target.value)}
              className="w-full glass-panel rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All NPK Formulations</option>
              <option value="high-n">High Nitrogen (e.g. Urea 46-0-0)</option>
              <option value="high-p">High Phosphorus (e.g. DAP 18-46-0, SSP)</option>
              <option value="high-k">High Potassium (e.g. MOP 0-0-60, SOP)</option>
              <option value="complex">Balanced Complex (19-19-19, 10-26-26)</option>
            </select>
          </div>
        </div>

        {/* Type Category Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Category:</span>
            </span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-emerald-500 text-white shadow-glow-sm'
                    : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {(searchQuery || selectedType !== 'All' || selectedNutrient !== 'All' || selectedNPKFilter !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Catalog Grid or Empty State */}
      {filteredFertilizers.length === 0 ? (
        <GlassCard className="py-20 text-center space-y-4 bg-white/90 dark:bg-[#121614] border border-emerald-500/20 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
            <FlaskConical className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('fertilizerLibrary.emptyTitle', 'No fertilizers match your search')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
              {t('fertilizerLibrary.emptyDesc', 'Try adjusting your search keywords, NPK filter, or primary nutrient parameters.')}
            </p>
          </div>
          <div className="pt-2">
            <MagneticButton size="sm" variant="primary" onClick={handleResetFilters}>
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('fertilizerLibrary.resetFilters', 'Reset Filters')}</span>
            </MagneticButton>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFertilizers.map((fert) => {
            const isFav = isFertFav(fert.id);
            const isComparing = compareIds.includes(fert.id);
            const fertName = fert.localNames?.[language] || fert.name;

            return (
              <GlassCard
                key={fert.id}
                onClick={() => setSelectedFertilizerForDetails(fert)}
                className="border border-emerald-500/20 dark:border-white/10 bg-white/90 dark:bg-[#121614] space-y-4 cursor-pointer hover:-translate-y-1 hover:border-emerald-500/50 transition-all duration-300 justify-between flex flex-col group shadow-sm"
              >
                <div className="space-y-3">
                  {/* Photo & Top Badges */}
                  <div className="h-40 w-full rounded-2xl overflow-hidden relative border border-emerald-500/20">
                    <img
                      src={fert.image}
                      alt={fertName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-extrabold text-emerald-400 border border-emerald-500/30">
                      NPK {fert.npkRatio}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFertilizer(fert.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:text-rose-400 transition-colors"
                      title="Save to favorites"
                    >
                      <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {fert.type} Fertilizer
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {fert.priceRange}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {fertName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {fert.description}
                  </p>

                  {/* NPK Color Pills */}
                  <div className="grid grid-cols-3 gap-1.5 text-center pt-1 font-mono text-[11px] font-bold">
                    <div className="rounded-lg bg-cyan-500/10 dark:bg-[#171C19] border border-cyan-500/30 py-1 text-cyan-700 dark:text-cyan-400">
                      N: {fert.composition.n}%
                    </div>
                    <div className="rounded-lg bg-violet-500/10 dark:bg-[#171C19] border border-violet-500/30 py-1 text-violet-700 dark:text-violet-400">
                      P: {fert.composition.p}%
                    </div>
                    <div className="rounded-lg bg-amber-500/10 dark:bg-[#171C19] border border-amber-500/30 py-1 text-amber-700 dark:text-amber-400">
                      K: {fert.composition.k}%
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={(e) => handleToggleCompare(fert.id, e)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isComparing
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-glow-sm'
                        : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {isComparing ? 'Selected ✓' : '+ Compare'}
                  </button>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Fertilizer Interactive Details Slide-Over / Modal */}
      <AnimatePresence>
        {selectedFertilizerForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden bg-white dark:bg-[#121614]"
            >
              {/* Modal Top Banner */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-emerald-500/10 dark:bg-[#151A18]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {selectedFertilizerForDetails.localNames?.[language] || selectedFertilizerForDetails.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Formula Ratio: NPK {selectedFertilizerForDetails.npkRatio}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFertilizerForDetails(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-500/10 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-medium">
                {/* Hero Photo & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <img
                    src={selectedFertilizerForDetails.image}
                    alt={selectedFertilizerForDetails.name}
                    className="sm:col-span-5 h-44 w-full rounded-2xl object-cover border border-emerald-500/30 shadow-sm"
                  />
                  <div className="sm:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 capitalize">
                        {selectedFertilizerForDetails.type} Formulation
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        {selectedFertilizerForDetails.priceRange}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {selectedFertilizerForDetails.description}
                    </p>

                    {/* NPK Breakdown Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono font-bold">
                      <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-2 text-cyan-700 dark:text-cyan-400">
                        <span className="block text-[9px] uppercase">Nitrogen</span>
                        <strong className="text-sm">{selectedFertilizerForDetails.composition.n}% N</strong>
                      </div>
                      <div className="rounded-xl bg-violet-500/10 border border-violet-500/30 p-2 text-violet-700 dark:text-violet-400">
                        <span className="block text-[9px] uppercase">Phosphorus</span>
                        <strong className="text-sm">{selectedFertilizerForDetails.composition.p}% P</strong>
                      </div>
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2 text-amber-700 dark:text-amber-400">
                        <span className="block text-[9px] uppercase">Potassium</span>
                        <strong className="text-sm">{selectedFertilizerForDetails.composition.k}% K</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Nutrients if supplied */}
                {selectedFertilizerForDetails.composition.others && (
                  <div className="rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/30 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold">
                    <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Secondary & Micronutrients: {selectedFertilizerForDetails.composition.others}</span>
                  </div>
                )}

                {/* Dosage, Method & Timing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white/80 dark:bg-[#171C19] p-4 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Recommended Dosage
                    </span>
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      {selectedFertilizerForDetails.dosagePerHectare}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 dark:bg-[#171C19] p-4 border border-blue-500/20 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Application Method
                    </span>
                    <div className="text-xs font-black text-blue-700 dark:text-blue-400">
                      {selectedFertilizerForDetails.applicationMethod}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 dark:bg-[#171C19] p-4 border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Best Growth Stage
                    </span>
                    <div className="text-xs font-black text-amber-700 dark:text-amber-400">
                      {selectedFertilizerForDetails.bestStage}
                    </div>
                  </div>
                </div>

                {/* Suitable Crops */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    🌱 Suitable Crop Types
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFertilizerForDetails.suitableCrops.map((cropKey) => (
                      <span
                        key={cropKey}
                        className="rounded-xl bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 px-3 py-1 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 capitalize"
                      >
                        {cropKey}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits & Precautions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-500/5 dark:bg-[#151A18] p-4 border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Agronomic Benefits</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {selectedFertilizerForDetails.advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-amber-500/5 dark:bg-[#151A18] p-4 border border-amber-500/30 space-y-2">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Handling Precautions</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {selectedFertilizerForDetails.precautions.map((prec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 dark:border-white/10 px-6 py-4 bg-emerald-500/5 dark:bg-[#151A18] flex items-center justify-between">
                <button
                  onClick={() => {
                    handleToggleCompare(selectedFertilizerForDetails.id);
                    setSelectedFertilizerForDetails(null);
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {compareIds.includes(selectedFertilizerForDetails.id)
                    ? 'Remove from comparison'
                    : '+ Add to Compare Matrix'}
                </button>

                <MagneticButton size="sm" variant="glass" onClick={() => setSelectedFertilizerForDetails(null)}>
                  Close Panel
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fertilizer Comparison Modal */}
      <FertilizerComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        selectedFertilizerIds={compareIds}
        onToggleFertilizer={handleToggleCompare}
      />
    </div>
  );
};
