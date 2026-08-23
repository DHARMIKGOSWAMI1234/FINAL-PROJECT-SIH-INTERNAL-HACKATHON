import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Sprout, ShieldCheck, Cpu, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {

  return (
    <div className="pt-28 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
          <Sprout className="h-4 w-4" />
          <span>Our Agritech Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
          About <span className="text-gradient">AGRISENSE</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          AGRISENSE is designed to bridge cutting-edge artificial intelligence with ground-level agricultural soil science. We empower Indian and global farmers to optimize crop nutrition, reduce chemical waste, and maximize yield return on investment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border border-emerald-500/20 space-y-3">
          <Cpu className="h-8 w-8 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">AI Soil Inference</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our algorithmic engine analyzes soil pH, texture, climate parameters, and NPK deficiencies to prescribe precise fertilizer dosages.
          </p>
        </GlassCard>

        <GlassCard className="border border-emerald-500/20 space-y-3">
          <Globe className="h-8 w-8 text-blue-400" />
          <h3 className="text-base font-extrabold text-white">Multilingual Accessibility</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Built with native support for English, Hindi, Gujarati, and regional Indian scripts so every farmer can use the platform comfortably.
          </p>
        </GlassCard>

        <GlassCard className="border border-emerald-500/20 space-y-3">
          <ShieldCheck className="h-8 w-8 text-amber-400" />
          <h3 className="text-base font-extrabold text-white">Eco-Sustainability</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Preventing over-fertilization protects soil organic carbon, prevents nitrate groundwater contamination, and lowers input costs.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
