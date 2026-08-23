import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import { MOCK_CROPS } from '../data/crops';
import { MOCK_FERTILIZERS } from '../data/fertilizers';
import { MOCK_ARTICLES } from '../data/articles';
import { GlassCard } from '../components/common/GlassCard';
import { MagneticButton } from '../components/common/MagneticButton';
import { Heart, Sprout, FlaskConical, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    favoriteRecommendations,
    favoriteCrops,
    favoriteFertilizers,
    favoriteArticles,
    loading,
    toggleRecommendation,
    toggleCrop,
    toggleFertilizer,
    toggleArticle,
  } = useFavorites();

  const [tab, setTab] = useState<'recommendations' | 'crops' | 'fertilizers' | 'articles'>(
    'recommendations'
  );

  const favCropObjects = MOCK_CROPS.filter((c) => favoriteCrops.includes(c.id));
  const favFertObjects = MOCK_FERTILIZERS.filter((f) => favoriteFertilizers.includes(f.id));
  const favArticleObjects = MOCK_ARTICLES.filter((a) => favoriteArticles.includes(a.id));

  return (
    <div className="pt-28 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('favorites.title', 'Saved Favorites')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('favorites.subtitle', 'Quick access to your saved recommendations, crops, fertilizers, and agritech articles.')}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="glass-panel inline-flex p-1 rounded-2xl border border-emerald-500/20 flex-wrap gap-1">
        <button
          onClick={() => setTab('recommendations')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
            tab === 'recommendations'
              ? 'bg-emerald-500 text-white shadow-glow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Saved Prescriptions ({favoriteRecommendations.length})</span>
        </button>

        <button
          onClick={() => setTab('crops')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
            tab === 'crops'
              ? 'bg-emerald-500 text-white shadow-glow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sprout className="h-4 w-4" />
          <span>{t('favorites.tabCrops', 'Saved Crops')} ({favCropObjects.length})</span>
        </button>

        <button
          onClick={() => setTab('fertilizers')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
            tab === 'fertilizers'
              ? 'bg-emerald-500 text-white shadow-glow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>{t('favorites.tabFertilizers', 'Saved Fertilizers')} ({favFertObjects.length})</span>
        </button>

        <button
          onClick={() => setTab('articles')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
            tab === 'articles'
              ? 'bg-emerald-500 text-white shadow-glow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{t('favorites.tabArticles', 'Saved Articles')} ({favArticleObjects.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading && favoriteRecommendations.length === 0 ? (
        <GlassCard className="py-20 text-center space-y-4 bg-white/90 dark:bg-[#121614] border border-emerald-500/20 shadow-sm">
          <div className="h-10 w-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Syncing favorites from Cloud Firestore...
          </p>
        </GlassCard>
      ) : (
        <>
          {/* 1. Saved Recommendations Tab */}
          {tab === 'recommendations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {favoriteRecommendations.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-3 glass-panel rounded-2xl p-8 border border-emerald-500/20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    No Saved Prescriptions Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                    Click the bookmark icon on any AI Recommendation report to pin it here for quick reference.
                  </p>
                  <div className="pt-2">
                    <MagneticButton size="sm" variant="primary" onClick={() => navigate('/advisor')}>
                      <Sparkles className="h-4 w-4" />
                      <span>Start Advisor Test</span>
                    </MagneticButton>
                  </div>
                </div>
              ) : (
                favoriteRecommendations.map((rec) => {
                  const cropName = rec.crop?.name || rec.recommended_crop || 'Crop Analysis';
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

                          <div className="flex items-center gap-2">
                            <span className="rounded-xl bg-emerald-500/15 px-3 py-1 text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              {rec.suitabilityScore || 90}% Match
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRecommendation(rec);
                              }}
                              title="Remove from Favorites"
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all cursor-pointer"
                            >
                              <Heart className="h-4 w-4 fill-rose-500" />
                            </button>
                          </div>
                        </div>

                        {/* Recommended Fertilizer & NPK */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                              Recommended Fertilizer:
                            </span>
                            <strong className="text-slate-900 dark:text-white font-extrabold">
                              {rec.primaryFertilizer?.name || rec.recommended_fertilizer} ({rec.recommendedDosage || 'Standard'})
                            </strong>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <span>Open Prescription Report</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. Saved Crops Tab */}
          {tab === 'crops' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favCropObjects.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {t('favorites.emptyTitle', 'No Favorites Saved Yet')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                    {t('favorites.emptyDesc', 'Click the heart icon on any crop profile to save it here.')}
                  </p>
                </div>
              ) : (
                favCropObjects.map((crop) => (
                  <GlassCard
                    key={crop.id}
                    onClick={() => navigate(`/crops/${crop.id}`)}
                    className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] space-y-3 cursor-pointer p-4 shadow-sm"
                  >
                    <div className="h-36 w-full rounded-xl overflow-hidden relative">
                      <img src={crop.image} alt={crop.name} className="h-full w-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCrop(crop.id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-red-500 cursor-pointer"
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{crop.name}</h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      NPK {crop.idealNPK.n}-{crop.idealNPK.p}-{crop.idealNPK.k}
                    </span>
                  </GlassCard>
                ))
              )}
            </div>
          )}

          {/* 3. Saved Fertilizers Tab */}
          {tab === 'fertilizers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favFertObjects.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {t('favorites.emptyTitle', 'No Favorites Saved Yet')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                    {t('favorites.emptyDesc', 'Click the heart icon on any fertilizer card to save it here.')}
                  </p>
                </div>
              ) : (
                favFertObjects.map((fert) => (
                  <GlassCard
                    key={fert.id}
                    onClick={() => navigate(`/fertilizers/${fert.id}`)}
                    className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] space-y-3 cursor-pointer p-4 shadow-sm"
                  >
                    <div className="h-36 w-full rounded-xl overflow-hidden relative">
                      <img src={fert.image} alt={fert.name} className="h-full w-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFertilizer(fert.id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-red-500 cursor-pointer"
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{fert.name}</h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      NPK {fert.npkRatio}
                    </span>
                  </GlassCard>
                ))
              )}
            </div>
          )}

          {/* 4. Saved Articles Tab */}
          {tab === 'articles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favArticleObjects.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {t('favorites.emptyTitle', 'No Favorites Saved Yet')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                    {t('favorites.emptyDesc', 'Click the heart icon on any article to save it here.')}
                  </p>
                </div>
              ) : (
                favArticleObjects.map((article) => (
                  <GlassCard
                    key={article.id}
                    onClick={() => navigate(`/insights/${article.id}`)}
                    className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] space-y-3 cursor-pointer p-4 shadow-sm"
                  >
                    <div className="h-36 w-full rounded-xl overflow-hidden relative">
                      <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArticle(article.id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-red-500 cursor-pointer"
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
                      </button>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2">
                      {article.title}
                    </h3>
                  </GlassCard>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
