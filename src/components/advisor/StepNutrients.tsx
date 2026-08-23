import React from 'react';
import { Crop } from '../../types';
import { useTranslation } from 'react-i18next';

interface StepNutrientsProps {
  crop: Crop;
  n: number;
  p: number;
  k: number;
  onChangeN: (val: number) => void;
  onChangeP: (val: number) => void;
  onChangeK: (val: number) => void;
}

export const StepNutrients: React.FC<StepNutrientsProps> = ({
  crop,
  n,
  p,
  k,
  onChangeN,
  onChangeP,
  onChangeK,
}) => {
  const { t } = useTranslation();

  const getStatus = (val: number, ideal: number) => {
    if (val < ideal * 0.7)
      return { label: t('advisor.low'), color: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (val > ideal * 1.3)
      return { label: t('advisor.high'), color: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { label: t('advisor.optimal'), color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  const nStatus = getStatus(n, crop.idealNPK.n);
  const pStatus = getStatus(p, crop.idealNPK.p);
  const kStatus = getStatus(k, crop.idealNPK.k);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.nutrientsTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          {t('advisor.nutrientsDesc')} Target NPK for{' '}
          <strong className="text-emerald-700 dark:text-emerald-400">{crop.name}</strong> is{' '}
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">
            {crop.idealNPK.n}-{crop.idealNPK.p}-{crop.idealNPK.k} kg/ha
          </span>.
        </p>
      </div>

      <div className="space-y-5">
        {/* Nitrogen (N) - Cyan Theme */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-cyan-500/5 dark:bg-[#121614] space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-cyan-700 dark:text-cyan-400">{t('advisor.nLabel')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${nStatus.color}`}>
                  {nStatus.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{t('advisor.nHint')}</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <input
                type="number"
                min="0"
                max="300"
                value={n}
                onChange={(e) => onChangeN(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 glass-panel rounded-xl px-3 py-1.5 text-right font-mono font-black text-base text-cyan-700 dark:text-cyan-400 border border-cyan-500/40 bg-white dark:bg-[#171C19] focus:outline-none focus:border-cyan-400"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">kg/ha</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="300"
            value={n}
            onChange={(e) => onChangeN(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>0 kg/ha</span>
            <span className="text-cyan-700 dark:text-cyan-400">Target: {crop.idealNPK.n} kg/ha</span>
            <span>300 kg/ha</span>
          </div>
        </div>

        {/* Phosphorus (P) - Violet Theme */}
        <div className="glass-panel rounded-2xl p-5 border border-violet-500/30 bg-violet-500/5 dark:bg-[#121614] space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-violet-700 dark:text-violet-400">{t('advisor.pLabel')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${pStatus.color}`}>
                  {pStatus.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{t('advisor.pHint')}</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <input
                type="number"
                min="0"
                max="200"
                value={p}
                onChange={(e) => onChangeP(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 glass-panel rounded-xl px-3 py-1.5 text-right font-mono font-black text-base text-violet-700 dark:text-violet-400 border border-violet-500/40 bg-white dark:bg-[#171C19] focus:outline-none focus:border-violet-400"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">kg/ha</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="200"
            value={p}
            onChange={(e) => onChangeP(parseInt(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>0 kg/ha</span>
            <span className="text-violet-700 dark:text-violet-400">Target: {crop.idealNPK.p} kg/ha</span>
            <span>200 kg/ha</span>
          </div>
        </div>

        {/* Potassium (K) - Amber Theme */}
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5 dark:bg-[#121614] space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">{t('advisor.kLabel')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${kStatus.color}`}>
                  {kStatus.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{t('advisor.kHint')}</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <input
                type="number"
                min="0"
                max="200"
                value={k}
                onChange={(e) => onChangeK(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 glass-panel rounded-xl px-3 py-1.5 text-right font-mono font-black text-base text-amber-700 dark:text-amber-400 border border-amber-500/40 bg-white dark:bg-[#171C19] focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">kg/ha</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="200"
            value={k}
            onChange={(e) => onChangeK(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>0 kg/ha</span>
            <span className="text-amber-700 dark:text-amber-400">Target: {crop.idealNPK.k} kg/ha</span>
            <span>200 kg/ha</span>
          </div>
        </div>
      </div>
    </div>
  );
};
