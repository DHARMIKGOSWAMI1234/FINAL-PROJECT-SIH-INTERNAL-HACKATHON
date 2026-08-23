import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, FlaskConical, Sprout, BookOpen, ArrowRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      title: t('dashboard.quickAction1Title'),
      desc: t('dashboard.quickAction1Desc'),
      icon: Sparkles,
      color: 'text-blue-500 bg-blue-500/15 border-blue-500/30',
      route: '/advisor',
    },
    {
      title: t('dashboard.quickAction2Title'),
      desc: t('dashboard.quickAction2Desc'),
      icon: FlaskConical,
      color: 'text-cyan-500 bg-cyan-500/15 border-cyan-500/30',
      route: '/advisor',
    },
    {
      title: t('dashboard.quickAction3Title'),
      desc: t('dashboard.quickAction3Desc'),
      icon: Sprout,
      color: 'text-amber-500 bg-amber-500/15 border-amber-500/30',
      route: '/crops',
    },
    {
      title: t('dashboard.quickAction4Title'),
      desc: t('dashboard.quickAction4Desc'),
      icon: BookOpen,
      color: 'text-violet-500 bg-violet-500/15 border-violet-500/30',
      route: '/insights',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <GlassCard
            key={idx}
            onClick={() => navigate(act.route)}
            className="p-5 rounded-2xl bg-[#E4E5EE] dark:bg-[#121614] border border-black/5 dark:border-white/10 hover:border-blue-500/40 transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${act.color} transition-transform group-hover:scale-110`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-warmwhite group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-mutedgray mt-0.5">
                  {act.desc}
                </p>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </GlassCard>
        );
      })}
    </div>
  );
};
