import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { SoilNutrientStatus } from '../../services/dashboardService';
import { Activity, Info, HelpCircle } from 'lucide-react';

interface SoilHealthWidgetProps {
  data: {
    pH: number;
    moisture: string;
    nutrients: SoilNutrientStatus[];
  };
}

export const SoilHealthWidget: React.FC<SoilHealthWidgetProps> = ({ data }) => {
  const { t } = useTranslation();
  const [selectedNutrient, setSelectedNutrient] = useState<SoilNutrientStatus | null>(data.nutrients[0]);

  return (
    <GlassCard className="p-6 sm:p-7 rounded-[28px] bg-[#E4E5EE] dark:bg-[#121614] border border-black/5 dark:border-white/10 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-500 font-bold border border-cyan-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-warmwhite leading-none">
              {t('dashboard.soilHealthTitle')}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-mutedgray mt-1 block">
              {t('dashboard.soilChemistrySub')}
            </span>
          </div>
        </div>

        {/* Global pH & Moisture Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-warmwhite">
            {t('dashboard.pHLabel', { pH: data.pH })}
          </div>
          <div className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-warmwhite">
            {t('dashboard.moistureLabel', { moisture: data.moisture })}
          </div>
        </div>
      </div>

      {/* Horizontal Nutrient Sliders */}
      <div className="space-y-4">
        {data.nutrients.map((nut, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedNutrient(nut)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedNutrient?.name === nut.name
                ? 'bg-blue-500/10 border-blue-500/40 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-900 dark:text-warmwhite flex items-center gap-1.5">
                {nut.name}
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] border font-extrabold ${nut.statusColor}`}>
                {nut.status}
              </span>
            </div>

            {/* Visual Horizontal Slider / Gauge */}
            <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  nut.status === 'Low'
                    ? 'bg-cyan-500'
                    : nut.status === 'Optimal'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${nut.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Explanation Box */}
      {selectedNutrient && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-warmwhite">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <span>{selectedNutrient.name}</span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">{t('dashboard.soilMeaning')}</strong> {selectedNutrient.explanation}
          </p>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">{t('dashboard.soilWhyMatters')}</strong> {selectedNutrient.whyItMatters}
          </p>

          <div className="pt-1 text-blue-600 dark:text-blue-400 font-bold border-t border-blue-500/20">
            {t('dashboard.soilAiRecommendation')} {selectedNutrient.recommendation}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
