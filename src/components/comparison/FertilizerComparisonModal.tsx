import { MOCK_FERTILIZERS } from '../../data/fertilizers';
import { X, CheckCircle2, Scale } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';

interface FertilizerComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFertilizerIds: string[];
  onToggleFertilizer: (id: string) => void;
}

export const FertilizerComparisonModal: React.FC<FertilizerComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedFertilizerIds,
  onToggleFertilizer,
}) => {
  if (!isOpen) return null;

  const compareItems = MOCK_FERTILIZERS.filter((f) => selectedFertilizerIds.includes(f.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 px-6 py-4 bg-emerald-500/10 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fertilizer Side-by-Side Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing {compareItems.length} of 3 selected fertilizers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content / Comparison Matrix */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Picker Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-emerald-500/10">
            <span className="text-xs font-semibold text-slate-400 mr-2">Select to compare:</span>
            {MOCK_FERTILIZERS.map((fert) => {
              const isSelected = selectedFertilizerIds.includes(fert.id);
              return (
                <button
                  key={fert.id}
                  onClick={() => onToggleFertilizer(fert.id)}
                  disabled={!isSelected && selectedFertilizerIds.length >= 3}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-glow-sm'
                      : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 disabled:opacity-40'
                  }`}
                >
                  {fert.name.split(' (')[0]}
                </button>
              );
            })}
          </div>

          {compareItems.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Please select at least 1 fertilizer from the chips above to begin comparison.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareItems.map((fert) => (
                <div
                  key={fert.id}
                  className="glass-panel rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Image & Header */}
                    <div className="h-32 w-full rounded-xl overflow-hidden relative">
                      <img
                        src={fert.image}
                        alt={fert.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 right-2 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        NPK {fert.npkRatio}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                      {fert.name}
                    </h4>

                    {/* Comparison Fields */}
                    <div className="space-y-2 text-xs divide-y divide-emerald-500/10">
                      <div className="pt-2">
                        <span className="font-bold text-emerald-500 block mb-0.5">Type & Price</span>
                        <span className="capitalize text-slate-700 dark:text-slate-300">
                          {fert.type} • {fert.priceRange}
                        </span>
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-emerald-500 block mb-0.5">Dosage / Hectare</span>
                        <span className="text-slate-700 dark:text-slate-300">{fert.dosagePerHectare}</span>
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-emerald-500 block mb-0.5">Application Method</span>
                        <span className="text-slate-700 dark:text-slate-300">{fert.applicationMethod}</span>
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-emerald-500 block mb-0.5">Best Growth Stage</span>
                        <span className="text-slate-700 dark:text-slate-300">{fert.bestStage}</span>
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-emerald-500 block mb-1">Key Advantages</span>
                        <ul className="space-y-1 text-[11px]">
                          {fert.advantages.map((adv, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFertilizer(fert.id)}
                    className="w-full text-center text-xs font-semibold text-red-400 hover:text-red-300 py-1"
                  >
                    Remove from comparison
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-500/20 px-6 py-4 bg-emerald-500/10 dark:bg-emerald-950/30 flex justify-end">
          <MagneticButton size="sm" variant="glass" onClick={onClose}>
            Close Comparison Matrix
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
