import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { INSIGHTS_ARTICLES, getLocalizedArticle } from '../../data/insights';
import { GlassCard } from '../common/GlassCard';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

interface InsightItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
}

interface AgriculturalInsightsGridProps {
  insights: InsightItem[];
}

export const AgriculturalInsightsGrid: React.FC<AgriculturalInsightsGridProps> = ({ insights }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Localize cards if they match articles in our master dataset
  const displayInsights = insights.map((item) => {
    const matched = INSIGHTS_ARTICLES.find((a) => a.id === item.id);
    if (matched) {
      const loc = getLocalizedArticle(matched, language);
      return {
        id: loc.id,
        title: loc.title,
        category: loc.categoryLabel,
        readTime: loc.readTime,
        image: loc.image,
      };
    }
    return item;
  });

  return (
    <GlassCard className="p-6 sm:p-7 rounded-[28px] bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/10 shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D8D3]/60 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-[#8B5CF6] font-bold border border-purple-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#17212B] dark:text-[#F8FAFC] leading-none">
              {t('dashboard.latestInsightsTitle')}
            </h3>
            <span className="text-[11px] text-[#596773] dark:text-[#94A3B8] mt-1 block">
              {t('dashboard.insightsSub')}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/insights')}
          className="text-xs font-bold text-[#06B6D4] hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{t('dashboard.exploreLibrary')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid of 3 Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayInsights.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/insights/${item.id}`)}
            className="group rounded-2xl overflow-hidden bg-[#FCFCF9] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3 p-4">
              <div className="h-36 w-full rounded-xl overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                  {item.category}
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-[#17212B] dark:text-[#F8FAFC] group-hover:text-[#06B6D4] dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
            </div>

            <div className="px-4 pb-4 flex items-center justify-between text-[11px] text-[#77838D] dark:text-[#94A3B8] border-t border-[#D6D8D3]/60 dark:border-white/5 pt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                {item.readTime}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#06B6D4] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
