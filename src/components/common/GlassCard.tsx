import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowOnHover?: boolean;
  accentBorder?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'terracotta' | 'none';
  onClick?: () => void;
  'data-cursor'?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowOnHover = true,
  accentBorder = 'none',
  onClick,
  'data-cursor': dataCursor,
}) => {
  const accentBorderStyles = {
    none: 'hover:border-slate-400 dark:hover:border-white/20',
    emerald: 'hover:border-emerald-500/50 hover:shadow-glow-emerald',
    cyan: 'hover:border-cyan-500/50 hover:shadow-glow-cyan',
    violet: 'hover:border-purple-500/50 hover:shadow-glow-violet',
    amber: 'hover:border-amber-500/50 hover:shadow-glow-amber',
    terracotta: 'hover:border-red-500/50',
  };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -6,
              scale: 1.01,
              transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] },
            }
          : undefined
      }
      onClick={onClick}
      data-cursor={dataCursor}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        glowOnHover ? accentBorderStyles[accentBorder] : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
