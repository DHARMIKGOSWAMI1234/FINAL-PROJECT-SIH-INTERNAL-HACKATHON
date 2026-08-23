import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DualModeToggle: React.FC = () => {
  const { infoMode, setInfoMode } = usePreferences();
  const { t } = useTranslation();

  return (
    <div className="glass-panel inline-flex items-center p-1 rounded-xl border border-emerald-500/20">
      <button
        onClick={() => setInfoMode('simple')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          infoMode === 'simple'
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-glow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{t('nav.simpleMode')}</span>
      </button>
      <button
        onClick={() => setInfoMode('advanced')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          infoMode === 'advanced'
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-glow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{t('nav.advancedMode')}</span>
      </button>
    </div>
  );
};
