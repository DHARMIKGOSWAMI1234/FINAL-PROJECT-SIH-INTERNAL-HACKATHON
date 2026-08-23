import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { Fertilizer } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { GlassCard } from '../components/common/GlassCard';
import { ArrowLeft, Heart, CheckCircle2, AlertTriangle } from 'lucide-react';

export const FertilizerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFertFav, toggleFertilizer } = useFavorites();
  const [fert, setFert] = useState<Fertilizer | null>(null);

  useEffect(() => {
    if (id) {
      ApiService.getFertilizer(id).then((res) => {
        if (res) setFert(res);
      });
    }
  }, [id]);

  if (!fert) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-400">Loading fertilizer details...</div>
    );
  }

  const isFav = isFertFav(fert.id);
  const displayName = fert.localNames?.[language] || fert.name;

  return (
    <div className="pt-28 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/fertilizers')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('fertilizerDetail.backToLibrary', 'Back to Fertilizer Library')}</span>
      </button>

      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 bg-white/90 dark:bg-[#121614] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
        <div className="md:col-span-5 h-64 w-full rounded-2xl overflow-hidden relative border border-emerald-500/30">
          <img src={fert.image} alt={fert.name} className="h-full w-full object-cover" />
          <button
            onClick={() => toggleFertilizer(fert.id)}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-red-400 cursor-pointer"
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              NPK {fert.npkRatio}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">{fert.type} Fertilizer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {displayName}
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {fert.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2">
            <span>Price Guide: {fert.priceRange}</span>
          </div>
        </div>
      </div>

      {/* Specifications & Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border border-emerald-500/20 bg-white/90 dark:bg-[#121614] p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('fertilizerLibrary.dosageRate', 'Recommended Dosage')}
          </span>
          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{fert.dosagePerHectare}</div>
        </GlassCard>

        <GlassCard className="border border-emerald-500/20 bg-white/90 dark:bg-[#121614] p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('fertilizerLibrary.appMethod', 'Application Method')}
          </span>
          <div className="text-sm font-black text-amber-600 dark:text-amber-400">{fert.applicationMethod}</div>
        </GlassCard>

        <GlassCard className="border border-emerald-500/20 bg-white/90 dark:bg-[#121614] p-5 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('fertilizerLibrary.bestStage', 'Optimal Growth Stage')}
          </span>
          <div className="text-sm font-black text-blue-600 dark:text-blue-400">{fert.bestStage}</div>
        </GlassCard>
      </div>

      {/* Advantages & Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="border border-emerald-500/30 bg-white/90 dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{t('fertilizerLibrary.benefits', 'Key Agronomic Advantages')}</span>
          </h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {fert.advantages.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="border border-amber-500/30 bg-white/90 dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>{t('fertilizerLibrary.precautions', 'Storage & Application Precautions')}</span>
          </h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {fert.precautions.map((prec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{prec}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};
