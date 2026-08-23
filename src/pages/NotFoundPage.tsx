import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '../components/common/MagneticButton';
import { Sprout, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-lg">
        <Sprout className="h-10 w-10 animate-bounce" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-4xl font-black text-gradient">404</span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          "Looks like this field doesn't exist."
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The page or crop record you are looking for might have been moved or removed.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MagneticButton size="md" variant="primary" onClick={() => navigate('/')}>
          <Home className="h-4 w-4" />
          <span>Back to AGRISENSE Home</span>
        </MagneticButton>
      </div>
    </div>
  );
};
