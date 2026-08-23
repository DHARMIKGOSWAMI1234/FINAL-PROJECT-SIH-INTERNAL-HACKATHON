import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTutorial } from '../../context/TutorialContext';
import { GlassCard } from './GlassCard';
import { Sparkles, ArrowRight, ArrowLeft, X, ArrowUp, ArrowDown } from 'lucide-react';

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type Placement = 'right' | 'bottom' | 'left' | 'top';

export const TutorialOverlay: React.FC = () => {
  const { t } = useTranslation();
  const {
    isActive,
    currentStepIndex,
    totalSteps,
    currentStep,
    isFinalStep,
    nextStep,
    prevStep,
    skipTour,
    finishTour,
  } = useTutorial();

  const [rect, setRect] = useState<ElementRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number | string;
    left: number | string;
    placement: Placement;
  }>({ top: 0, left: 0, placement: 'right' });

  const cardRef = useRef<HTMLDivElement>(null);

  // Find & track bounding rectangle of highlighted element
  useEffect(() => {
    if (!isActive || !currentStep) {
      setRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(`[data-tour="${currentStep.tourId}"]`);
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const tooltipW = Math.min(340, sw - 32);
      const tooltipH = 220;
      const gap = 18;

      if (!el) {
        setRect(null);
        setTooltipPos({
          left: Math.max(16, (sw - tooltipW) / 2),
          top: Math.max(16, (sh - tooltipH) / 2),
          placement: 'bottom',
        });
        return;
      }

      let r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        setRect(null);
        setTooltipPos({
          left: Math.max(16, (sw - tooltipW) / 2),
          top: Math.max(16, (sh - tooltipH) / 2),
          placement: 'bottom',
        });
        return;
      }

      // Auto scroll element into view if offscreen
      if (r.top < 0 || r.bottom > sh) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        r = el.getBoundingClientRect();
      }

      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });

      if (r.left < 280) {
        // Sidebar item → tooltip to the right
        const tooltipTop = Math.max(16, Math.min(r.top - 10, sh - tooltipH - 16));
        setTooltipPos({ left: r.left + r.width + gap, top: tooltipTop, placement: 'right' });
      } else if (r.top + r.height + gap + tooltipH > sh && r.top - tooltipH - gap > 0) {
        // Near bottom of screen → place above
        const tooltipLeft = Math.max(16, Math.min(r.left, sw - tooltipW - 16));
        setTooltipPos({ left: tooltipLeft, top: r.top - tooltipH - gap, placement: 'top' });
      } else if (r.left + r.width + gap + tooltipW < sw) {
        // Room to the right
        const tooltipTop = Math.max(16, Math.min(r.top - 10, sh - tooltipH - 16));
        setTooltipPos({ left: r.left + r.width + gap, top: tooltipTop, placement: 'right' });
      } else {
        // Fall back to below
        const tooltipLeft = Math.max(16, Math.min(r.left, sw - tooltipW - 16));
        const tooltipTop = Math.max(16, Math.min(r.top + r.height + gap, sh - tooltipH - 16));
        setTooltipPos({ left: tooltipLeft, top: tooltipTop, placement: 'bottom' });
      }
    };

    // Small delay to allow DOM to settle after step change
    const initialTimer = setTimeout(updatePosition, 80);
    const interval = setInterval(updatePosition, 250);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isActive, currentStep]);

  if (!isActive) return null;

  // ── Final Completion Modal ──
  if (isFinalStep) {
    return (
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
        <GlassCard className="max-w-sm w-full p-8 text-center space-y-5 bg-white dark:bg-[#121614] border border-emerald-500/30 shadow-2xl rounded-3xl relative overflow-hidden">
          {/* Background glow orb */}
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-white mx-auto shadow-[0_0_24px_rgba(16,185,129,0.5)]">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('tutorial.finalTitle', "You're all set! 🌱")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              {t(
                'tutorial.finalDesc',
                "Now you're ready to use AGRISENSE to analyze your fields and get AI-powered fertilizer recommendations."
              )}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={finishTour}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 text-xs font-black transition-all cursor-pointer shadow-md"
            >
              <span>{t('tutorial.startBtn', 'Start Using AGRISENSE')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={skipTour}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer py-1 transition-colors"
            >
              {t('tutorial.replayBtn', 'Replay Tour Later')}
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!currentStep) return null;

  const isMobile = window.innerWidth < 640;

  // ── Arrow direction based on tooltip placement ──
  const ArrowIcon = tooltipPos.placement === 'bottom' ? ArrowUp : tooltipPos.placement === 'top' ? ArrowDown : ArrowRight;

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-auto overflow-hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop — click to skip */}
      <div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1.5px]"
        onClick={skipTour}
      />

      {/* ── Target Element Spotlight Ring ── */}
      {rect && (
        <div
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
          className="fixed z-[9991] rounded-2xl ring-[3px] ring-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_0_30px_rgba(16,185,129,0.4)] pointer-events-none transition-all duration-350 ease-out animate-in fade-in"
        />
      )}

      {/* ── Animated Arrow pointing from tooltip to the element ── */}
      {rect && !isMobile && (
        <div
          style={
            tooltipPos.placement === 'right'
              ? {
                  // Arrow on left side of spotlight (pointing right toward element)
                  top: rect.top + rect.height / 2 - 12,
                  left: rect.left - 36,
                }
              : {
                  // Arrow above or below spotlight
                  top: tooltipPos.placement === 'bottom' ? rect.top - 36 : (rect.top + rect.height + 8),
                  left: rect.left + rect.width / 2 - 12,
                }
          }
          className="fixed z-[9992] pointer-events-none"
        >
          <div className="animate-bounce text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
            <ArrowIcon className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </div>
      )}

      {/* ── Tooltip Card ── */}
      <div
        ref={cardRef}
        style={
          isMobile
            ? { bottom: 16, left: 16, right: 16 }
            : {
                top: tooltipPos.top,
                left: tooltipPos.left,
              }
        }
        className="fixed z-[9992] max-w-sm w-[calc(100%-32px)] sm:w-[340px] pointer-events-auto transition-all duration-300 ease-out"
      >
        <GlassCard className="p-5 bg-white dark:bg-[#121614] border border-emerald-500/30 dark:border-emerald-800/50 shadow-2xl rounded-3xl space-y-4">

          {/* Header: step badge + close */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {t('tutorial.stepIndicator', { current: currentStepIndex + 1, total: totalSteps })}
            </span>
            <button
              onClick={skipTour}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={t('tutorial.skip', 'Skip Tour')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step content */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {t(currentStep.titleKey)}
            </h4>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(currentStep.descKey)}
            </p>
          </div>

          {/* Progress dots + nav buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
            {/* Dot indicators */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-5 bg-emerald-500'
                      : idx < currentStepIndex
                      ? 'w-1.5 bg-emerald-300 dark:bg-emerald-700'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={prevStep}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t('tutorial.back', 'Back')}</span>
                </button>
              )}
              <button
                onClick={nextStep}
                className="px-4 py-1.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-1 shadow-md"
              >
                <span>
                  {currentStepIndex === totalSteps - 1
                    ? t('tutorial.finish', 'Finish')
                    : t('tutorial.next', 'Next')}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

