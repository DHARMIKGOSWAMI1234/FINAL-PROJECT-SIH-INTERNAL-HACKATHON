import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import {
  ArrowRight,
  Sprout,
  FlaskConical,
  Zap,
  ChevronDown,
  Layers,
  CloudRain,
  Bot,
  Compass,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Scroll Parallax Hooks for Hero Section
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], shouldReduceMotion ? [0, 0] : [0, -35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], shouldReduceMotion ? [1, 1] : [1, 0.8]);

  return (
    <div className="bg-[#F2F1EC] dark:bg-[#080C0E] min-h-screen text-[#17212B] dark:text-[#F8FAFC] transition-colors duration-300 overflow-x-hidden">
      
      {/* ── 1. HERO SECTION ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 overflow-hidden"
      >
        {/* Subtle Background Atmospheric Depth Accents */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.03] blur-[140px]" />
          <div className="absolute top-36 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/[0.025] dark:bg-purple-500/[0.025] blur-[140px]" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Hero Narrative */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Eyebrow Status Badge (Neutral & Subtle) */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4]/90 dark:bg-[#151E24] text-[#596773] dark:text-[#94A3B8] shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  {t('hero.eyebrow', 'Agrisense Precision Engine Active')}
                </span>
              </div>

              {/* Main Headline (Multi-Color Gradient Highlight: Cyan -> Blue -> Violet) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC] leading-[1.08]">
                {t('hero.titleMain', 'Intelligence for')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-[#38BDF8] to-[#8B5CF6]">
                  {t('hero.titleHighlight', 'Every Acre.')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#596773] dark:text-[#94A3B8] max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal">
                {t('hero.subtitle', 'Unified precision agriculture platform combining soil chemistry telemetry, AI crop recommendation, NPK fertilizer optimization, and real-time weather intelligence.')}
              </p>

              {/* Primary / Secondary CTAs (Sophisticated AI-Product Cyan->Blue CTA) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/advisor')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-semibold text-sm sm:text-base rounded-xl transition-all duration-200 shadow-glow-cyan flex items-center gap-2.5 group cursor-pointer"
                >
                  <span>{t('hero.ctaPrimary', 'Start Soil Analysis')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/crops')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#F8F8F4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/10 hover:bg-[#FCFCF9] dark:hover:bg-[#1D2A32] text-[#17212B] dark:text-[#F8FAFC] font-medium text-sm sm:text-base rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                >
                  {t('hero.ctaSecondary', 'Explore Platform')}
                </button>
              </div>

              {/* Verified Capability Proof Points (Multi-Color Semantic Accents) */}
              <div className="pt-4 border-t border-[#D6D8D3] dark:border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#596773] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-[#8B5CF6]" />
                  <span>{t('hero.trust1', '16+ Crop ML Models')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[#F59E0B]" />
                  <span>{t('hero.trust2', 'Soil Chemistry Telemetry')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#06B6D4]" />
                  <span>{t('hero.trust3', 'Real-Time Weather Advisory')}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Precision Telemetry Command Center Card */}
            <div className="lg:col-span-6 w-full relative">
              <div className="relative rounded-2xl p-6 sm:p-8 bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D1D6D3] dark:border-white/[0.08] shadow-md dark:shadow-2xl backdrop-blur-xl overflow-hidden group">
                
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between pb-6 border-b border-[#D6D8D3] dark:border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#06B6D4] animate-ping" />
                    <span className="font-mono text-xs text-[#77838D] dark:text-[#94A3B8] uppercase tracking-wider">
                      Telemetry Node: #AGRI-84C71 • Live
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 dark:bg-purple-500/20 text-[#8B5CF6] border border-purple-500/30">
                    Dual-Engine ML
                  </span>
                </div>

                {/* Grid & Parcel Canvas Area (High-Contrast Dark Mission Control Terminal Viewport) */}
                <div className="relative my-6 aspect-[16/10] rounded-xl bg-[#0B1115] border border-slate-800 overflow-hidden flex items-center justify-center">
                  
                  {/* Abstract Precision Agricultural Grid Pattern */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:24px_24px]" />
                  
                  {/* Subtle Multi-Color Geometric Parcels */}
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 250" fill="none">
                    <polygon points="40,30 180,20 160,110 30,100" stroke="#10B981" strokeWidth="1.5" fill="#10B981" fillOpacity="0.08" />
                    <polygon points="190,20 360,35 340,120 170,110" stroke="#06B6D4" strokeWidth="1.5" fill="#06B6D4" fillOpacity="0.08" />
                    <polygon points="30,120 150,125 130,220 20,200" stroke="#F59E0B" strokeWidth="1.5" fill="#F59E0B" fillOpacity="0.08" />
                    <polygon points="160,125 350,135 330,230 140,220" stroke="#8B5CF6" strokeWidth="1.5" fill="#8B5CF6" fillOpacity="0.08" />
                    <line x1="20" y1="20" x2="380" y2="230" stroke="#ffffff" strokeDasharray="3 6" strokeOpacity="0.12" />
                  </svg>

                  {/* Rotating Precision Crosshair Reticle */}
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
                      <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-[spin_20s_linear_infinite]" />
                      <div className="absolute inset-2 rounded-full border border-purple-400/30 animate-[spin_12s_linear_infinite_reverse]" />
                      <div className="h-10 w-10 rounded-full bg-cyan-500/15 backdrop-blur-md flex items-center justify-center text-cyan-400">
                        <Compass className="h-6 w-6 animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-3 font-mono text-[11px] text-cyan-400 tracking-wider">
                      LAT: 21.17° N • LON: 72.83° E
                    </div>
                  </div>

                  {/* Floating Telemetry Badge Top-Left (Emerald for Soil State) */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#0F161A]/95 border border-emerald-500/30 backdrop-blur-md shadow-sm">
                    <div className="text-[10px] text-[#94A3B8]">{t('hero.soilHealth', 'Soil Health Index')}</div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-[#10B981] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
                      {t('hero.soilStatus', 'Balanced pH 6.8')}
                    </div>
                  </div>

                  {/* Floating Telemetry Badge Top-Right (Cyan for Weather) */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#0F161A]/95 border border-cyan-500/30 backdrop-blur-md shadow-sm">
                    <div className="text-[10px] text-[#94A3B8]">{t('hero.weatherLabel', 'Micro-Climate Telemetry')}</div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-[#06B6D4] flex items-center gap-1">
                      <CloudRain className="h-3.5 w-3.5" />
                      {t('hero.weatherStatus', 'Spray Window Active')}
                    </div>
                  </div>

                  {/* Floating Telemetry Badge Bottom (Amber for Nutrients) */}
                  <div className="absolute bottom-3 inset-x-3 px-3 py-1.5 rounded-lg bg-[#0F161A]/95 border border-amber-500/30 backdrop-blur-md flex items-center justify-between">
                    <div className="text-[10px] text-[#94A3B8] font-mono">
                      NPK Balance: <span className="text-[#F59E0B] font-bold">N:45 • P:25 • K:30 kg/ha</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold">
                      Calibrated
                    </span>
                  </div>
                </div>

                {/* Card Bottom Quick Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center font-mono">
                  <div className="p-2.5 rounded-lg bg-[#EAEAE4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/[0.04]">
                    <div className="text-[10px] text-[#77838D] dark:text-[#94A3B8]">Target Soil</div>
                    <div className="text-xs font-bold text-[#17212B] dark:text-[#F8FAFC]">Loamy</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#EAEAE4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/[0.04]">
                    <div className="text-[10px] text-[#77838D] dark:text-[#94A3B8]">Moisture</div>
                    <div className="text-xs font-bold text-[#06B6D4]">42% (Good)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#EAEAE4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/[0.04]">
                    <div className="text-[10px] text-[#77838D] dark:text-[#94A3B8]">Rec. Crop</div>
                    <div className="text-xs font-bold text-[#10B981]">Wheat (HD)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#EAEAE4] dark:bg-[#151E24] border border-[#D6D8D3] dark:border-white/[0.04]">
                    <div className="text-[10px] text-[#77838D] dark:text-[#94A3B8]">Rec. Dose</div>
                    <div className="text-xs font-bold text-[#F59E0B]">DAP + Urea</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ── 2. REAL-TIME CAPABILITY TICKER ── */}
      <div className="w-full border-y border-[#D6D8D3] dark:border-white/[0.08] bg-[#EAEAE4] dark:bg-[#0B1115] backdrop-blur-md py-4 overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#596773] dark:text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="font-semibold text-[#17212B] dark:text-[#F8FAFC]">Soil Chemistry:</span> N, P, K, pH Telemetry
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
              <span className="font-semibold text-[#17212B] dark:text-[#F8FAFC]">Micro-Climate Feed:</span> OpenWeather Sync
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              <span className="font-semibold text-[#17212B] dark:text-[#F8FAFC]">AI Agronomist:</span> Gemini Diagnostic Advisor
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span className="font-semibold text-[#17212B] dark:text-[#F8FAFC]">Crop ML Models:</span> 16+ Varieties
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. CORE INTELLIGENCE CAPABILITIES (5 SEMANTIC PILLARS) ── */}
      <section className="py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-white/5 text-[#596773] dark:text-[#94A3B8] text-xs font-mono font-semibold uppercase">
            {t('features.eyebrow', 'Platform Capabilities')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
            {t('features.title', 'Intelligence for Every Acre')}
          </h2>
          <p className="text-sm sm:text-base text-[#596773] dark:text-[#94A3B8]">
            {t('features.subtitle', 'Explore the full capabilities built into AGRISENSE to increase crop yields, lower fertilizer expenses, and protect long-term soil health.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Capability 1: Soil Chemistry Telemetry (Amber nutrient accent) */}
          <GlassCard
            accentBorder="amber"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B]">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('features.f1Title', 'AI Soil & NPK Advisory Engine')}
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              {t('features.f1Desc', 'Input soil test results (N, P, K levels, pH, organic matter) to generate exact kg/hectare dosage recommendations customized to your crop target.')}
            </p>
            <div className="pt-2">
              <Link to="/advisor" className="text-xs font-semibold text-[#F59E0B] hover:underline flex items-center gap-1">
                Launch Soil Analysis →
              </Link>
            </div>
          </GlassCard>

          {/* Capability 2: AI Crop Recommendation Engine (Emerald crop health accent) */}
          <GlassCard
            accentBorder="emerald"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#10B981]">
              <Sprout className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('features.f2Title', 'Comprehensive Crop Library')}
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              {t('features.f2Desc', 'Explore optimal nutrient requirements, pH ranges, moisture tolerances, and growth stages for 30+ staple and cash crops.')}
            </p>
            <div className="pt-2">
              <Link to="/crops" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
                Browse Crop Profiles →
              </Link>
            </div>
          </GlassCard>

          {/* Capability 3: Precision Fertilizer Engine (Cyan technology accent) */}
          <GlassCard
            accentBorder="cyan"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#06B6D4]">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('features.f3Title', 'Fertilizer Catalog & Dosing')}
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              {t('features.f3Desc', 'Access detailed chemical and organic fertilizer profiles (Urea, DAP, NPK complexes, MOP, SSP) with application guides.')}
            </p>
            <div className="pt-2">
              <Link to="/fertilizers" className="text-xs font-semibold text-[#06B6D4] hover:underline flex items-center gap-1">
                Explore Fertilizers →
              </Link>
            </div>
          </GlassCard>

          {/* Capability 4: Weather & Micro-Climate Advisory (Blue/Cyan telemetry accent) */}
          <GlassCard
            accentBorder="cyan"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3B82F6]">
              <CloudRain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              Micro-Climate & Spray Telemetry
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              Real-time atmospheric monitoring with precipitation alerts that warn you before rain events to prevent fertilizer runoff and nutrient loss.
            </p>
            <div className="pt-2">
              <Link to="/dashboard" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
                View Weather Telemetry →
              </Link>
            </div>
          </GlassCard>

          {/* Capability 5: 24/7 Gemini AI Agronomist (Violet neural intelligence accent) */}
          <GlassCard
            accentBorder="violet"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B5CF6]">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('features.f5Title', '24/7 AI Agronomist Chat')}
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              {t('features.f5Desc', 'Instant interactive assistant for diagnostic pest queries, soil management advice, and seasonal fertilizer application tips.')}
            </p>
            <div className="pt-2">
              <Link to="/assistant" className="text-xs font-semibold text-[#8B5CF6] hover:underline flex items-center gap-1">
                Ask AI Agronomist →
              </Link>
            </div>
          </GlassCard>

          {/* Capability 6: Farmer Control Center Dashboard (Slate/Blue SaaS accent) */}
          <GlassCard
            accentBorder="none"
            hoverEffect={true}
            className="p-8 space-y-4 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08]"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-500/10 dark:bg-white/5 border border-[#D6D8D3] dark:border-white/10 flex items-center justify-center text-[#17212B] dark:text-[#F8FAFC]">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
              {t('features.f4Title', 'Control Center Dashboard')}
            </h3>
            <p className="text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
              {t('features.f4Desc', 'Store past soil test records, track input savings over time, manage favorite crops, and view field health score analytics.')}
            </p>
            <div className="pt-2">
              <Link to="/dashboard" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
                Open Dashboard →
              </Link>
            </div>
          </GlassCard>

        </div>
      </section>

      {/* ── 4. COMMAND CENTER WORKFLOW (3-STEP PIPELINE) ── */}
      <section className="py-20 bg-[#EAEAE4]/70 dark:bg-[#0B1115]/50 border-y border-[#D6D8D3] dark:border-white/[0.06]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-white/5 text-[#596773] dark:text-[#94A3B8] text-xs font-mono font-semibold uppercase">
              {t('how.eyebrow', 'Precision Architecture')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
              {t('how.title', 'How AGRISENSE Delivers Precision')}
            </h2>
            <p className="text-sm sm:text-base text-[#596773] dark:text-[#94A3B8]">
              {t('how.subtitle', 'A scientific 3-step workflow from ground truth telemetry to actionable execution plans.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1: Ingest (Cyan Telemetry Accent) */}
            <div className="p-8 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] relative text-center group glow-cyan">
              <div className="w-14 h-14 mx-auto bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 text-[#06B6D4] shadow-sm">
                <FlaskConical className="h-7 w-7" />
              </div>
              <div className="font-mono text-xs font-bold text-[#06B6D4] uppercase tracking-widest mb-1">
                01. Ingest
              </div>
              <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC] mb-2">
                {t('how.step1Title', 'Understand Your Soil')}
              </h3>
              <p className="text-xs text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                {t('how.step1Desc', 'Analyze soil conditions, pH levels, and current N-P-K nutrient deficits before selecting fertilizers.')}
              </p>
            </div>

            {/* Step 2: Process (Violet Neural Accent) */}
            <div className="p-8 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] relative text-center group glow-violet">
              <div className="w-14 h-14 mx-auto bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-[#8B5CF6] shadow-sm">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="font-mono text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-1">
                02. Process
              </div>
              <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC] mb-2">
                {t('how.step2Title', 'AI Multi-Model Processing')}
              </h3>
              <p className="text-xs text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                {t('how.step2Desc', 'Neural algorithms evaluate your target crop requirements against soil deficit and local micro-climate forecast.')}
              </p>
            </div>

            {/* Step 3: Execute (Blue Execution Accent) */}
            <div className="p-8 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] relative text-center group glow-cyan">
              <div className="w-14 h-14 mx-auto bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-[#3B82F6] shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="font-mono text-xs font-bold text-[#3B82F6] uppercase tracking-widest mb-1">
                03. Execute
              </div>
              <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC] mb-2">
                {t('how.step3Title', 'Actionable Prescription Plan')}
              </h3>
              <p className="text-xs text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                {t('how.step3Desc', 'Receive exact split-dosage schedules and downloadable PDF reports for immediate field implementation.')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. COMPARISON: TRADITIONAL VS AGRISENSE PRECISION ── */}
      <section className="py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-white/5 text-[#596773] dark:text-[#94A3B8] text-xs font-mono font-semibold uppercase">
            {t('comparison.eyebrow', 'Comparative Value')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
            {t('comparison.title', 'Traditional Guesswork vs. AGRISENSE')}
          </h2>
          <p className="text-sm sm:text-base text-[#596773] dark:text-[#94A3B8]">
            {t('comparison.subtitle', 'See how precision AI agronomy replaces wasteful generic fertilizer applications.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Guesswork */}
          <div className="p-8 rounded-2xl bg-red-500/[0.03] dark:bg-red-500/[0.04] border border-red-500/20 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-red-500/15">
              <div>
                <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
                  {t('comparison.tradTitle', 'Traditional Guesswork')}
                </h3>
                <span className="text-xs font-mono text-red-500 font-semibold">
                  {t('comparison.tradTag', 'Unprecise & Costly')}
                </span>
              </div>
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8]">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>{t('comparison.tradPoint1', 'Applying static fertilizer amounts regardless of actual soil deficiencies.')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>{t('comparison.tradPoint2', 'Spending money on nutrients your soil already possesses in surplus.')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5 font-bold">✕</span>
                <span>{t('comparison.tradPoint3', 'Over-application causes soil acidification, salinity, and runoff pollution.')}</span>
              </li>
            </ul>
          </div>

          {/* AGRISENSE Precision */}
          <div className="p-8 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-cyan-500/30 dark:border-cyan-500/30 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div>
                <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
                  {t('comparison.aiTitle', 'AGRISENSE Precision')}
                </h3>
                <span className="text-xs font-mono text-[#06B6D4] font-semibold">
                  {t('comparison.aiTag', 'Data-Driven & Optimized')}
                </span>
              </div>
              <CheckCircle2 className="h-6 w-6 text-[#06B6D4]" />
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8]">
              <li className="flex items-start gap-3">
                <span className="text-[#06B6D4] mt-0.5 font-bold">✓</span>
                <span>{t('comparison.aiPoint1', 'Exact N-P-K nutrient ratio computed specifically for your soil test & target crop yield.')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#06B6D4] mt-0.5 font-bold">✓</span>
                <span>{t('comparison.aiPoint2', 'Save 20% to 40% on fertilizer purchases by applying only what is needed.')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#06B6D4] mt-0.5 font-bold">✓</span>
                <span>{t('comparison.aiPoint3', 'Preserve soil microbiology, maintain pH balance, and sustain multi-year fertility.')}</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ── 6. FARMER TESTIMONIAL ── */}
      <section className="py-20 bg-[#EAEAE4]/70 dark:bg-[#0B1115]/60 border-t border-[#D6D8D3] dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-white/5 text-[#596773] dark:text-[#94A3B8] text-xs font-mono font-semibold uppercase">
            {t('testimonial.eyebrow', 'Field Proven')}
          </div>
          <blockquote className="text-xl sm:text-2xl font-semibold text-[#17212B] dark:text-[#F8FAFC] leading-snug">
            {t('testimonial.title', '"AGRISENSE saved me over 30% on urea costs this season."')}
          </blockquote>
          <p className="text-sm text-[#596773] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            {t('testimonial.subtitle', 'Before using AGRISENSE, I relied on standard local dosage advice. The AI tool showed me exact N-P-K ratios based on my soil pH, giving me a record harvest while spending less money on fertilizers.')}
          </p>
          <div className="pt-2">
            <div className="font-bold text-sm text-[#17212B] dark:text-[#F8FAFC]">
              {t('testimonial.author', 'Ramesh Patel')}
            </div>
            <div className="text-xs text-[#77838D] dark:text-[#94A3B8] font-mono">
              {t('testimonial.location', 'Gujarat, India • 25 Acres Wheat & Cotton Farmer')}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ── */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-white/5 text-[#596773] dark:text-[#94A3B8] text-xs font-mono font-semibold uppercase">
            {t('faq.eyebrow', 'FAQ')}
          </div>
          <h2 className="text-3xl font-bold text-[#17212B] dark:text-[#F8FAFC]">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: t('faq.q1', 'Do I need a formal lab soil test to use AGRISENSE?'), a: t('faq.a1', 'While a lab soil report gives the highest precision, AGRISENSE also provides accurate estimations based on your crop type, soil texture (clay, loam, sand), and field history.') },
            { q: t('faq.q2', 'How does AGRISENSE save money on fertilizers?'), a: t('faq.a2', 'Most farmers over-apply Nitrogen or Phosphorus by 30-50%. AGRISENSE computes exact nutrient deficits, preventing you from buying unnecessary bags.') },
            { q: t('faq.q3', 'Which crops are supported in the platform?'), a: t('faq.a3', 'We support over 30 major crops including Wheat, Rice/Paddy, Maize, Cotton, Sugarcane, Potato, Tomato, Pulses, Mustard, Soybean, and various fruits.') },
            { q: t('faq.q4', 'Is my soil history saved securely?'), a: t('faq.a4', 'Yes! All your soil test reports and recommendation history are saved directly in your personal Dashboard control center for easy tracking season after season.') },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#17212B] dark:text-[#F8FAFC] cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-[#06B6D4]' : 'text-slate-400'
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed border-t border-[#D6D8D3]/60 dark:border-white/[0.04] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. FINAL CONVERSION BANNER ── */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-[#17212B] to-[#0F161A] dark:from-[#0F161A] dark:to-[#151E24] border border-slate-700/60 dark:border-white/10 shadow-2xl text-white">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to optimize your acreage?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Deploy enterprise-grade agricultural intelligence on your soil today. Start a free precision analysis and get tailored N-P-K schedules.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/advisor')}
                className="px-8 py-4 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-bold text-base rounded-xl transition-all shadow-glow-cyan cursor-pointer inline-flex items-center gap-2"
              >
                <span>Start Soil Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

