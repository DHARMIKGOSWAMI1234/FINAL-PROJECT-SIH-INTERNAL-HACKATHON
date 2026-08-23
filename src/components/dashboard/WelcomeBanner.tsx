import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../common/MagneticButton';
import { Sparkles, ArrowRight, History } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div data-tour="welcome-banner" className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#F1F5F9] via-[#E2E8F0] to-[#F1F5F9] dark:from-slate-950 dark:via-charcoal-card dark:to-blue-950 p-6 sm:p-8 border border-black/10 dark:border-blue-500/30 shadow-md dark:shadow-xl transition-all">
      {/* Background Farmland Imagery with Opacity Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
          alt="Farmland Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E4E5EE] via-[#E8EEF5]/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-500 dark:text-blue-400" />
            <span>{t('dashboard.aiControlCenter')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {t('dashboard.greeting', { name: user?.displayName || 'Dharmik' })}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <MagneticButton
            size="md"
            variant="primary"
            onClick={() => navigate('/advisor')}
            data-cursor="agri"
            data-tour="soil-analysis"
            className="shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none text-xs px-6 py-3"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t('dashboard.getNewRecommendation')}</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>

          <MagneticButton
            size="md"
            variant="glass"
            onClick={() => navigate('/history')}
            className="text-xs px-5 py-3 text-slate-700 dark:text-slate-200"
          >
            <History className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span>{t('dashboard.viewHistory')}</span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
