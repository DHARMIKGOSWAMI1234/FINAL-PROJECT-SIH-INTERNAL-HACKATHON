import React from 'react';
import { motion } from 'framer-motion';

interface SuitabilityGaugeProps {
  score: number; // e.g. 94
  label?: string;
}

export const SuitabilityGauge: React.FC<SuitabilityGaugeProps> = ({ score, label = 'AI Match Score' }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 120 120">
        {/* Track background */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-slate-200 dark:stroke-darkbg-hover"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-emerald-500 shadow-glow-md"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Centered Score */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {score}<span className="text-emerald-500 text-lg">%</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Match
        </span>
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  );
};
