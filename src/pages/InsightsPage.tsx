import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import {
  INSIGHTS_ARTICLES,
  InsightCategory,
  getLocalizedArticle,
  getLocalizedFarmerTips,
  getCategoryLabel,
} from '../data/insights';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  FlaskConical,
  Layers,
  CloudRain,
  ShieldCheck,
  Lightbulb,
  Droplets,
  Gauge,
  HelpCircle,
  X,
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories Definition with dynamic translation
  const categoryIds: Array<{ id: string; type: InsightCategory | 'all'; color: string }> = [
    { id: 'all', type: 'all', color: 'neutral' },
    { id: 'soil-npk', type: 'soil-npk', color: 'amber' },
    { id: 'crop-management', type: 'crop-management', color: 'emerald' },
    { id: 'fertilizers', type: 'fertilizers', color: 'violet' },
    { id: 'weather-irrigation', type: 'weather-irrigation', color: 'cyan' },
    { id: 'sustainable-farming', type: 'sustainable-farming', color: 'blue' },
    { id: 'farmer-tips', type: 'farmer-tips', color: 'neutral' },
  ];

  // Localized articles collection for current language
  const localizedArticles = useMemo(() => {
    return INSIGHTS_ARTICLES.map((article) => getLocalizedArticle(article, language));
  }, [language]);

  // Featured article (localized)
  const featuredArticle = useMemo(() => {
    const rawFeatured = INSIGHTS_ARTICLES.find((a) => a.featured) || INSIGHTS_ARTICLES[0];
    return getLocalizedArticle(rawFeatured, language);
  }, [language]);

  // Localized Farmer Tips
  const localizedFarmerTips = useMemo(() => {
    return getLocalizedFarmerTips(language);
  }, [language]);

  // Filtered Articles based on category & search query
  const filteredArticles = useMemo(() => {
    return localizedArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : article.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q) ||
        article.introduction.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [localizedArticles, selectedCategory, searchQuery]);

  // Helper for category badge styling
  const getCategoryBadgeClass = (cat: InsightCategory | string) => {
    switch (cat) {
      case 'soil-npk':
        return 'bg-amber-500/10 text-[#F59E0B] border-amber-500/30';
      case 'crop-management':
        return 'bg-emerald-500/10 text-[#10B981] border-emerald-500/30';
      case 'fertilizers':
        return 'bg-purple-500/10 text-[#8B5CF6] border-purple-500/30';
      case 'weather-irrigation':
        return 'bg-cyan-500/10 text-[#06B6D4] border-cyan-500/30';
      case 'sustainable-farming':
        return 'bg-blue-500/10 text-[#3B82F6] border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/30';
    }
  };

  // Helper for tip icon
  const getTipIcon = (id: string) => {
    switch (id) {
      case 'tip-1':
        return <FlaskConical className="h-5 w-5 text-[#F59E0B]" />;
      case 'tip-2':
        return <CloudRain className="h-5 w-5 text-[#06B6D4]" />;
      case 'tip-3':
        return <Gauge className="h-5 w-5 text-[#F59E0B]" />;
      case 'tip-4':
        return <Layers className="h-5 w-5 text-[#8B5CF6]" />;
      case 'tip-5':
        return <ShieldCheck className="h-5 w-5 text-[#3B82F6]" />;
      case 'tip-6':
        return <Droplets className="h-5 w-5 text-[#10B981]" />;
      default:
        return <Lightbulb className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] dark:bg-[#080C0E] text-[#17212B] dark:text-[#F8FAFC] transition-colors duration-300 pt-28 pb-24">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">

        {/* ── 1. PAGE HEADER & SEARCH ── */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#151E24] text-[#596773] dark:text-[#94A3B8] shadow-sm">
            <BookOpen className="h-3.5 w-3.5 text-[#06B6D4]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              {t('insights.badge', 'AGRISENSE Knowledge Center')}
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
            {t('insights.title', 'Agriculture Insights')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#596773] dark:text-[#94A3B8] leading-relaxed">
            {t('insights.subtitle', 'Practical agronomy knowledge to help you make better decisions for every acre.')}
          </p>

          {/* Search Input Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-[#77838D] dark:text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('insights.searchPlaceholder', 'Search agricultural guides, crops, soil, fertilizers...')}
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/10 text-xs sm:text-sm text-[#17212B] dark:text-[#F8FAFC] placeholder-[#77838D] dark:placeholder-slate-400 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-[#77838D] hover:text-[#17212B] dark:hover:text-[#F8FAFC] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. FEATURED AGRONOMY GUIDE ── */}
        {!searchQuery && (selectedCategory === 'all' || selectedCategory === 'soil-npk') && featuredArticle && (
          <div className="pt-2">
            <div
              onClick={() => navigate(`/insights/${featuredArticle.id}`)}
              className="group relative rounded-3xl p-6 sm:p-10 bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06] blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Left Image Viewport */}
                <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[16/10] bg-[#0B1115] relative shadow-md">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold font-mono text-cyan-400 border border-cyan-500/30">
                    {t('insights.featuredGuideBadge', 'Featured Master Guide')}
                  </div>
                </div>

                {/* Right Narrative */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(featuredArticle.category)}`}>
                      {featuredArticle.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#77838D] dark:text-[#94A3B8]">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17212B] dark:text-[#F8FAFC] group-hover:text-[#06B6D4] dark:group-hover:text-cyan-400 transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                    {featuredArticle.description}
                  </p>

                  <div className="pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/insights/${featuredArticle.id}`);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-semibold text-xs sm:text-sm shadow-glow-cyan flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{t('insights.readGuide', 'Read Complete Guide')}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. CATEGORY FILTERS ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#596773] dark:text-[#94A3B8]">
              {t('insights.filterCategories', 'Filter by Topic')}
            </h3>
            <span className="text-xs text-[#77838D] dark:text-[#94A3B8] font-mono">
              {filteredArticles.length} {filteredArticles.length === 1 ? t('insights.articleFound', 'Article Found') : t('insights.articlesFound', 'Articles Found')}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {categoryIds.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const displayLabel = getCategoryLabel(cat.type, language);

              // Distinct semantic color styling per active category
              let activeStyle = 'bg-[#17212B] text-white dark:bg-[#151E24] dark:text-white border-[#17212B] dark:border-white/20';
              if (isSelected) {
                if (cat.id === 'soil-npk') activeStyle = 'bg-[#F59E0B] text-black border-[#F59E0B] shadow-sm';
                else if (cat.id === 'crop-management') activeStyle = 'bg-[#10B981] text-black border-[#10B981] shadow-sm';
                else if (cat.id === 'fertilizers') activeStyle = 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm';
                else if (cat.id === 'weather-irrigation') activeStyle = 'bg-[#06B6D4] text-black border-[#06B6D4] shadow-sm';
                else if (cat.id === 'sustainable-farming') activeStyle = 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm';
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[40px] border ${
                    isSelected
                      ? activeStyle
                      : 'bg-[#F8F8F4] dark:bg-[#0F161A] text-[#596773] dark:text-[#94A3B8] border-[#D6D8D3] dark:border-white/10 hover:border-cyan-500/40 hover:text-[#17212B] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. ARTICLE GRID ── */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/insights/${article.id}`)}
                className="group rounded-2xl overflow-hidden bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] hover:border-[#06B6D4]/50 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Article Thumbnail with Realistic Image & Zoom on Hover */}
                  <div className="aspect-[16/10] w-full overflow-hidden relative bg-[#0B1115]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border backdrop-blur-md shadow-sm ${getCategoryBadgeClass(article.category)}`}>
                        {article.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#17212B] dark:text-[#F8FAFC] group-hover:text-[#06B6D4] dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#596773] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Footer Bar with Reading Time & Read Action */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#D6D8D3]/60 dark:border-white/[0.06] flex items-center justify-between text-xs text-[#77838D] dark:text-[#94A3B8]">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {article.readTime}
                  </span>
                  <span className="text-[#06B6D4] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t('insights.readArticle', 'Read Article')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 p-8 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/10 space-y-3">
            <HelpCircle className="h-10 w-10 text-[#77838D] mx-auto" />
            <h4 className="text-base font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('insights.noMatchingTitle', 'No matching agronomy guides found')}
            </h4>
            <p className="text-xs text-[#596773] dark:text-[#94A3B8] max-w-sm mx-auto">
              {t('insights.noMatchingDesc', 'Try searching with different terms such as "NPK", "Soil pH", "Urea", or "Irrigation".')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#17212B] dark:bg-[#151E24] text-white text-xs font-semibold cursor-pointer"
            >
              {t('insights.resetFilters', 'Reset Filters')}
            </button>
          </div>
        )}

        {/* ── 5. QUICK FARMER TIPS SECTION ── */}
        <section className="pt-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#EAEAE4] dark:bg-[#0B1115] border border-[#D6D8D3] dark:border-white/[0.08] space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] text-xs font-mono font-semibold uppercase mb-2">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{t('insights.fieldDirectives', 'Field Directives')}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
                  {t('insights.tipsTitle', 'Quick Farmer Tips')}
                </h3>
              </div>
              <p className="text-xs text-[#596773] dark:text-[#94A3B8] max-w-md">
                {t('insights.tipsSubtitle', 'Essential agronomic practices distilled into actionable rules for immediate application in your fields.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {localizedFarmerTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-5 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.06] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#EAEAE4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/10">
                      {getTipIcon(tip.id)}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getCategoryBadgeClass(tip.categoryType)}`}>
                      {tip.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#17212B] dark:text-[#F8FAFC] leading-snug">
                    {tip.tip}
                  </h4>

                  <p className="text-[11px] text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                    {tip.explanation}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. AGRISENSE AI ADVICE CONNECTION BANNER ── */}
        <section className="pt-4">
          <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-br from-[#17212B] to-[#0F161A] dark:from-[#0F161A] dark:to-[#151E24] border border-slate-700/60 dark:border-white/10 shadow-2xl text-white">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>{t('insights.aiCtaBadge', 'AI Agronomy Engine')}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {t('insights.aiCtaTitle', 'Need Advice for YOUR Farm?')}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('insights.aiCtaSubtitle', 'Use AGRISENSE AI to analyze your soil, crop and environmental conditions and receive a personalized recommendation.')}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/advisor')}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-glow-cyan cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{t('insights.aiCtaButton', 'Start Soil Analysis')}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
