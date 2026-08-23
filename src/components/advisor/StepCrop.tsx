import React, { useState } from 'react';
import { MOCK_CROPS } from '../../data/crops';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StepCropProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
}

export const StepCrop: React.FC<StepCropProps> = ({ selectedCropId, onSelectCrop }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { key: 'All', label: t('advisor.categoryAll') },
    { key: 'Cereal', label: t('advisor.categoryCereal') },
    { key: 'Pulse', label: t('advisor.categoryPulse') },
    { key: 'Vegetable', label: t('advisor.categoryVegetable') },
    { key: 'Cash Crop', label: t('advisor.categoryCash') },
    { key: 'Oilseed', label: t('advisor.categoryOilseed') },
    { key: 'Fruit', label: t('advisor.categoryFruit') },
  ];

  const filteredCrops = MOCK_CROPS.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      (crop.localNames[language] && crop.localNames[language].toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === 'All' || crop.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.selectCropTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('advisor.selectCropDesc')}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('advisor.searchCrops')}
            className="w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? 'bg-emerald-500 text-white shadow-glow-sm'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          const displayName = crop.localNames[language] || crop.name;

          return (
            <div
              key={crop.id}
              onClick={() => onSelectCrop(crop.id)}
              className={`group glass-panel relative rounded-2xl overflow-hidden p-3 transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-glow-md ring-2 ring-emerald-500/50'
                  : 'border-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-1'
              }`}
            >
              {/* Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-glow-sm">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}

              {/* Crop Photo */}
              <div className="h-28 w-full rounded-xl overflow-hidden relative mb-2">
                <img
                  src={crop.image}
                  alt={crop.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                  {crop.season}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {displayName}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{crop.category}</span>
                  <span className="font-mono text-emerald-400 font-bold">NPK {crop.idealNPK.n}-{crop.idealNPK.p}-{crop.idealNPK.k}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
