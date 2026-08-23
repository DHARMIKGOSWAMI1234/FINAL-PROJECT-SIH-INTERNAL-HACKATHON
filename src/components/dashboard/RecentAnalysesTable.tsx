import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { MagneticButton } from '../common/MagneticButton';
import { RecentAnalysisItem } from '../../services/dashboardService';
import { History, ArrowRight, Sprout, ShieldCheck } from 'lucide-react';

interface RecentAnalysesTableProps {
  items: RecentAnalysisItem[];
}

export const RecentAnalysesTable: React.FC<RecentAnalysesTableProps> = ({ items }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <GlassCard className="p-6 sm:p-7 rounded-[28px] bg-[#E4E5EE] dark:bg-[#121614] border border-black/5 dark:border-white/10 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 font-bold border border-blue-500/20">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-warmwhite leading-none">
              {t('dashboard.recentAnalysesTitle')}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-mutedgray mt-1 block">
              {t('dashboard.pastAnalysesSub')}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="text-xs font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <span>{t('dashboard.viewAllHistory')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 dark:text-mutedgray space-y-4">
          <Sprout className="h-10 w-10 text-blue-500/40 mx-auto" />
          <p className="max-w-md mx-auto">{t('dashboard.emptyAnalyses')}</p>
          <MagneticButton
            size="sm"
            variant="primary"
            onClick={() => navigate('/advisor')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none"
          >
            <span>{t('dashboard.getNewRecommendation')}</span>
          </MagneticButton>
        </div>
      ) : (
        /* List of Records */
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/history')}
              className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={item.image}
                  alt={item.cropName}
                  className="h-11 w-11 rounded-2xl object-cover border border-black/10 dark:border-white/10 shrink-0"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-warmwhite group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {item.cropName} • <span className="font-normal text-slate-500 dark:text-slate-400">{item.field}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-mutedgray mt-0.5">
                    {item.fertilizer} • {item.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-black/5 dark:border-white/5">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-500 border border-blue-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t('dashboard.matchBadge', { score: item.matchScore })}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
