import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { MOCK_CROPS } from '../data/crops';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const CropsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isCropFav, toggleCrop } = useFavorites();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');

  const categories = ['All', 'Cereal', 'Pulse', 'Vegetable', 'Cash Crop', 'Oilseed'];
  const seasons = ['All', 'Kharif', 'Rabi', 'All-Season'];

  const filteredCrops = MOCK_CROPS.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      (crop.localNames[language] && crop.localNames[language].toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesSeason = selectedSeason === 'All' || crop.season === selectedSeason;
    return matchesSearch && matchesCategory && matchesSeason;
  });

  return (
    <div className="pt-28 pb-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('crops.title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('crops.subtitle')}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('crops.searchPlaceholder')}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Categories & Seasons Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-glow-sm'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/20 mx-1 hidden sm:block" />
          {seasons.map((seas) => (
            <button
              key={seas}
              onClick={() => setSelectedSeason(seas)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedSeason === seas
                  ? 'bg-cyan-600 text-white shadow-glow-sm'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-cyan-500/10'
              }`}
            >
              {seas}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCrops.map((crop) => {
          const isFav = isCropFav(crop.id);
          const displayName = crop.localNames[language] || crop.name;

          return (
            <GlassCard
              key={crop.id}
              onClick={() => navigate(`/crops/${crop.id}`)}
              className="border border-emerald-500/20 space-y-4 cursor-pointer hover:-translate-y-1 transition-all"
            >
              {/* Photo & Favorite Button */}
              <div className="h-40 w-full rounded-xl overflow-hidden relative">
                <img
                  src={crop.image}
                  alt={crop.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCrop(crop.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:text-red-400 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <span className="absolute bottom-2 left-2 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {crop.season}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {displayName}
                </h3>
                <span className="text-[11px] text-slate-400">{crop.scientificName}</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-500/10">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{t('crops.idealpH')}</span>
                  <span className="font-mono text-emerald-400 font-bold">{crop.idealpH.min} - {crop.idealpH.max}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{t('crops.growingDays')}</span>
                  <span className="font-bold text-slate-200">{crop.growingDays} days</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>{t('crops.viewProfile')}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
