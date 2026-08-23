import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { usePreferences } from '../context/PreferencesContext';
import { generateFarmReportPDF } from '../services/pdfGenerator';
import { GlassCard } from '../components/common/GlassCard';
import { MagneticButton } from '../components/common/MagneticButton';
import {
  Sprout,
  Trash2,
  ArrowRight,
  Sparkles,
  Search,
  Calendar,
  ArrowUpDown,
  Eye,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { history, loading, deleteRecommendation, clearHistory } = useHistory();
  const { farm } = usePreferences();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Derive unique crop names for filter dropdown
  const availableCropNames = useMemo(() => {
    const crops = new Set<string>();
    history.forEach((rec) => {
      if (rec.crop?.name) crops.add(rec.crop.name);
    });
    return Array.from(crops);
  }, [history]);

  // Filter and sort history items
  const filteredHistory = useMemo(() => {
    return history
      .filter((rec) => {
        const matchesQuery =
          searchQuery === '' ||
          rec.crop?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.primaryFertilizer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.soil?.soilType?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCrop =
          selectedCropFilter === 'All' || rec.crop?.name === selectedCropFilter;

        const matchesSeason =
          selectedSeasonFilter === 'All' || rec.crop?.season === selectedSeasonFilter;

        return matchesQuery && matchesCrop && matchesSeason;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [history, searchQuery, selectedCropFilter, selectedSeasonFilter, sortOrder]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteRecommendation(id);
    showToast('Removed', 'Recommendation removed from your history.', 'info');
  };

  const handleClearAll = async () => {
    await clearHistory();
    showToast('History Cleared', 'All saved recommendations have been removed.');
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Saved Records ({history.length})</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {t('history.title', 'Recommendation History')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-medium">
            {t('history.subtitle', 'View and manage all your past AI soil test recommendations and fertilizer prescriptions.')}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-2.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      {history.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 dark:border-white/10 bg-white/90 dark:bg-[#121614] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('history.searchPlaceholder', 'Search saved crops or fertilizers...')}
              className="w-full glass-panel rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Crop Filter */}
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full glass-panel rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Crops</option>
              {availableCropNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <select
              value={selectedSeasonFilter}
              onChange={(e) => setSelectedSeasonFilter(e.target.value)}
              className="w-full glass-panel rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Seasons</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
              <option value="All-Season">All-Season</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="w-full glass-panel rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading or Empty or Grid */}
      {loading && history.length === 0 ? (
        <GlassCard className="py-20 text-center space-y-4 bg-white/90 dark:bg-[#121614] border border-emerald-500/20 shadow-sm">
          <div className="h-10 w-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Syncing recommendations from Cloud Firestore...
          </p>
        </GlassCard>
      ) : filteredHistory.length === 0 ? (
        <GlassCard className="py-20 text-center space-y-4 bg-white/90 dark:bg-[#121614] border border-emerald-500/20 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
            <Sprout className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('history.emptyTitle', 'Your recommendations will appear here.')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
              {history.length === 0
                ? 'Run the Fertilizer Advisor to compute and save your first soil test prescription.'
                : 'No saved recommendations match your current search and filter criteria.'}
            </p>
          </div>

          <div className="pt-2">
            <MagneticButton size="md" variant="primary" onClick={() => navigate('/advisor')}>
              <Sparkles className="h-4 w-4" />
              <span>{t('history.createRec', 'Create Recommendation')}</span>
            </MagneticButton>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredHistory.map((rec) => {
              const cropName = rec.crop?.localNames?.[language] || rec.crop?.name || 'Crop Analysis';
              const dateStr = new Date(rec.timestamp).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard
                    onClick={() => navigate(`/recommendation/${rec.id}`, { state: { result: rec } })}
                    className="border border-emerald-500/20 dark:border-white/10 bg-white/90 dark:bg-[#121614] shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer space-y-4 relative group"
                  >
                    {/* Top Item Bar */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rec.crop?.image}
                          alt={cropName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="h-12 w-12 rounded-xl object-cover border border-emerald-500/30 shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {cropName}
                          </h3>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                            {rec.crop?.season || 'Rabi'} • {dateStr}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-xl bg-emerald-500/15 px-3 py-1 text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        {rec.suitabilityScore}% Match
                      </span>
                    </div>

                    {/* Recommended Fertilizer Badge & Soil NPK Badges */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                          Recommended Fertilizer:
                        </span>
                        <strong className="text-slate-900 dark:text-white font-extrabold">
                          {rec.primaryFertilizer?.name} ({rec.recommendedDosage})
                        </strong>
                      </div>

                      {/* Soil & NPK Badges */}
                      <div className="grid grid-cols-4 gap-2 text-center pt-1">
                        <div className="rounded-lg bg-slate-100 dark:bg-[#171C19] border border-slate-200 dark:border-slate-800 p-1.5">
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase block">
                            Soil
                          </span>
                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white">
                            {rec.soil?.soilType}
                          </span>
                        </div>

                        <div className="rounded-lg bg-cyan-500/10 dark:bg-[#171C19] border border-cyan-500/30 p-1.5">
                          <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-bold uppercase block">
                            N
                          </span>
                          <span className="text-[11px] font-black text-cyan-700 dark:text-cyan-400 font-mono">
                            {rec.soil?.n} kg/ha
                          </span>
                        </div>

                        <div className="rounded-lg bg-violet-500/10 dark:bg-[#171C19] border border-violet-500/30 p-1.5">
                          <span className="text-[9px] text-violet-700 dark:text-violet-400 font-bold uppercase block">
                            P
                          </span>
                          <span className="text-[11px] font-black text-violet-700 dark:text-violet-400 font-mono">
                            {rec.soil?.p} kg/ha
                          </span>
                        </div>

                        <div className="rounded-lg bg-amber-500/10 dark:bg-[#171C19] border border-amber-500/30 p-1.5">
                          <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold uppercase block">
                            K
                          </span>
                          <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 font-mono">
                            {rec.soil?.k} kg/ha
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleDeleteItem(rec.id, e)}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Delete recommendation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              generateFarmReportPDF(rec, farm);
                              showToast('PDF Downloaded', `Saved PDF report for ${cropName}!`, 'success');
                            } catch (err) {
                              console.error(err);
                              showToast('PDF Error', 'Failed to generate PDF.', 'error');
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                          title="Download PDF Farm Report"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-500" />
                          <span>PDF Report</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
