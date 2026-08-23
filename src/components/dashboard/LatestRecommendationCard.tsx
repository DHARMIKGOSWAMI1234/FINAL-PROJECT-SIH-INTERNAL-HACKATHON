import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { MagneticButton } from '../common/MagneticButton';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LatestRecommendationCardProps {
  data: {
    cropName: string;
    field: string;
    matchScore: number;
    recommendedFertilizer: string;
    dosage: string;
    npk: { n: number; p: number; k: number };
    status: {
      n: string;
      p: string;
      k: string;
    };
  };
}

export const LatestRecommendationCard: React.FC<LatestRecommendationCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <GlassCard className="p-6 sm:p-7 rounded-[28px] bg-[#E4E5EE] dark:bg-[#121614] border border-black/5 dark:border-white/10 shadow-xl space-y-6 relative overflow-hidden">
      {/* Radial Corner Accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 font-bold border border-blue-500/20">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              {t('dashboard.latestRecTitle')}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-warmwhite">
              {data.cropName} • <span className="text-slate-500 dark:text-slate-400 font-normal">{data.field}</span>
            </h3>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-black text-blue-600 dark:text-blue-400 border border-blue-500/30">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <span>{t('dashboard.matchBadge', { score: data.matchScore })}</span>
        </div>
      </div>

      {/* Recommended Fertilizer Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs text-slate-500 dark:text-mutedgray font-semibold">
            {t('dashboard.recommendedFormula')}
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-warmwhite">
            {data.recommendedFertilizer}
          </div>
          <div className="inline-block px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-500">
            {t('dashboard.dosageLabel', { dosage: data.dosage })}
          </div>
        </div>

        {/* NPK Breakdown Metrics */}
        <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          {/* N */}
          <div className="space-y-1 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 block">N</span>
            <span className="text-base font-black text-slate-900 dark:text-warmwhite block font-mono">{data.npk.n}</span>
            <span className="text-[9px] text-slate-500 dark:text-mutedgray block">kg/ha</span>
          </div>

          {/* P */}
          <div className="space-y-1 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400 block">P</span>
            <span className="text-base font-black text-slate-900 dark:text-warmwhite block font-mono">{data.npk.p}</span>
            <span className="text-[9px] text-slate-500 dark:text-mutedgray block">kg/ha</span>
          </div>

          {/* K */}
          <div className="space-y-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 block">K</span>
            <span className="text-base font-black text-slate-900 dark:text-warmwhite block font-mono">{data.npk.k}</span>
            <span className="text-[9px] text-slate-500 dark:text-mutedgray block">kg/ha</span>
          </div>
        </div>
      </div>

      {/* Field Status & CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-black/5 dark:border-white/5">
        <div className="space-y-1 text-xs text-slate-600 dark:text-mutedgray">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
            <span>{data.status.n}</span>
          </div>
        </div>

        <MagneticButton
          size="sm"
          variant="primary"
          onClick={() => navigate('/advisor')}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none text-xs px-5 py-2.5"
        >
          <span>{t('dashboard.viewFullRec')}</span>
          <ArrowRight className="h-4 w-4" />
        </MagneticButton>
      </div>
    </GlassCard>
  );
};
