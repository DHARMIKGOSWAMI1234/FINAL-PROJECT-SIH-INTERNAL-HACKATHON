import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepAnalysisProps {
  onComplete: () => void;
}

export const StepAnalysis: React.FC<StepAnalysisProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    t('advisor.analyzingStage1'),
    t('advisor.analyzingStage2'),
    t('advisor.analyzingStage3'),
    t('advisor.analyzingStage4'),
    t('advisor.analyzingStage5'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete, stages.length]);

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-300">
      {/* Glowing AI Scanning Orb */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="h-28 w-28 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-lime-400 opacity-80 blur-xl"
        />
        <div className="absolute flex h-20 w-20 items-center justify-center rounded-2xl glass-panel border border-emerald-400 shadow-glow-lg text-emerald-400">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.analyzingTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('advisor.analyzingSubtitle')}
        </p>
      </div>

      {/* Stage Checklist */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-emerald-500/20 space-y-3 text-left">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs font-semibold transition-all ${
                isDone
                  ? 'text-emerald-400 font-bold'
                  : isCurrent
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 shrink-0 text-emerald-500 animate-spin" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-slate-600" />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
