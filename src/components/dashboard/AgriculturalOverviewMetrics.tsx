import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { DashboardMetric } from '../../services/dashboardService';
import { Activity, CheckCircle2, Sprout, BookOpen, ArrowUpRight } from 'lucide-react';

interface AgriculturalOverviewMetricsProps {
  metrics: DashboardMetric[];
}

export const AgriculturalOverviewMetrics: React.FC<AgriculturalOverviewMetricsProps> = ({ metrics }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const iconMap: Record<string, React.ElementType> = {
    analyses: Activity,
    recommendations: CheckCircle2,
    savedCrops: Sprout,
    savedFertilizers: BookOpen,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-black text-slate-900 dark:text-warmwhite flex items-center justify-between">
        <span>{t('dashboard.overviewTitle')}</span>
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = iconMap[m.id] || Activity;
          return (
            <GlassCard
              key={m.id}
              onClick={() => navigate(m.route)}
              className="p-5 rounded-2xl bg-white dark:bg-[#121614] border border-slate-300 dark:border-white/10 hover:border-blue-500/40 transition-all cursor-pointer group hover:-translate-y-1 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {t(m.labelKey)}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${m.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-3xl font-black text-slate-900 dark:text-warmwhite font-mono">
                  {m.value}
                </div>
                <div className="text-[10px] font-bold text-blue-500 flex items-center gap-0.5">
                  <span>{m.changeKey ? t(m.changeKey) : m.change}</span>
                  <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
