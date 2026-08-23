import React from 'react';
import { SoilType } from '../../types';
import { useTranslation } from 'react-i18next';
import { Check, Sliders, Layers, Droplet } from 'lucide-react';

interface StepSoilProps {
  selectedSoilType: SoilType;
  onSelectSoilType: (soil: SoilType) => void;
  pH: number;
  onPhChange: (ph: number) => void;
  soilMoisture: number;
  onMoistureChange: (moisture: number) => void;
}

export const StepSoil: React.FC<StepSoilProps> = ({
  selectedSoilType,
  onSelectSoilType,
  pH,
  onPhChange,
  soilMoisture,
  onMoistureChange,
}) => {
  const { t } = useTranslation();

  const soils: { type: SoilType; label: string; desc: string; image: string }[] = [
    {
      type: 'Loamy',
      label: 'Loamy Soil (दोमट / બેસાલ)',
      desc: 'Ideal balance of sand, silt, and clay. Excellent moisture retention and nutrient aeration.',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    },
    {
      type: 'Sandy',
      label: 'Sandy Soil (रेतीली / રેતાળ)',
      desc: 'High drainage and aeration. Requires frequent light irrigation and organic compost to hold nutrients.',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    },
    {
      type: 'Clay',
      label: 'Clay Soil (चिकनी / માટીયાળ)',
      desc: 'High nutrient storage capacity, but prone to waterlogging and compaction.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      type: 'Black',
      label: 'Black Cotton Soil (काली / કાળી)',
      desc: 'Rich in calcium, carbonate, and potash. Highly moisture-retentive, perfect for cotton and sugarcane.',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    },
    {
      type: 'Red',
      label: 'Red Soil (लाल / રાતી)',
      desc: 'High iron content with porous structure. Responds well to phosphorus starter fertilizers.',
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    },
    {
      type: 'Alluvial',
      label: 'Alluvial Soil (जलोढ़ / કાંપની)',
      desc: 'Highly fertile river basin soil rich in potash and organic sediment.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const getPhStatusText = (val: number) => {
    if (val < 6.0) return t('advisor.phAcidic');
    if (val > 7.5) return t('advisor.phAlkaline');
    return t('advisor.phNeutral');
  };

  const getPhStatusColor = (val: number) => {
    if (val < 6.0) return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (val > 7.5) return 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/30';
    return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const phPercentage = Math.min(100, Math.max(0, ((pH - 4.5) / (9.0 - 4.5)) * 100));

  const getMoistureStatus = (val: number) => {
    if (val < 30) return { label: 'Low / Dry Soil', cls: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (val > 70) return { label: 'Saturated / Wet', cls: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { label: 'Optimal Moisture', cls: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.selectSoilTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          {t('advisor.selectSoilDesc')}
        </p>
      </div>

      {/* Soil Type Select Dropdown Header Control */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#121614] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <label htmlFor="soil-type-dropdown" className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('advisor.soilDropdownLabel')}
            </label>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Selected: <strong className="text-emerald-600 dark:text-emerald-400">{selectedSoilType}</strong>
            </span>
          </div>
        </div>

        <select
          id="soil-type-dropdown"
          value={selectedSoilType}
          onChange={(e) => onSelectSoilType(e.target.value as SoilType)}
          className="w-full sm:w-64 glass-panel rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {soils.map((s) => (
            <option key={s.type} value={s.type} className="bg-white dark:bg-[#171C19] text-slate-900 dark:text-white">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Soil Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {soils.map((s) => {
          const isSelected = selectedSoilType === s.type;

          return (
            <div
              key={s.type}
              onClick={() => onSelectSoilType(s.type)}
              className={`glass-panel relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border bg-white/90 dark:bg-[#121614] shadow-sm ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/40'
                  : 'border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:-translate-y-1'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-glow-sm">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/20">
                  <img
                    src={s.image}
                    alt={s.label}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">{s.label}</h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Texture Profile</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Soil pH & Soil Moisture Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Soil pH */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-4 bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {t('advisor.soilPhTitle')}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t('advisor.phHint')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getPhStatusColor(pH)}`}>
                {getPhStatusText(pH)}
              </span>
              <input
                type="number"
                min="4.5"
                max="9.0"
                step="0.1"
                value={pH}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onPhChange(Math.min(9.0, Math.max(4.5, val)));
                }}
                className="w-16 glass-panel rounded-xl px-2 py-1 text-center font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#171C19] border border-emerald-500/30 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <input
            type="range"
            min="4.5"
            max="9.0"
            step="0.1"
            value={pH}
            onChange={(e) => onPhChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />

          <div className="relative h-2.5 w-full rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-400 to-purple-600 shadow-inner">
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white border border-black rounded-full transition-all duration-150 -translate-x-1/2"
              style={{ left: `${phPercentage}%` }}
            />
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="glass-panel rounded-2xl p-5 border border-sky-500/20 dark:border-white/10 space-y-4 bg-white/90 dark:bg-[#121614] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Volumetric Soil Moisture
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Volumetric Water Content</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getMoistureStatus(soilMoisture).cls}`}>
                {getMoistureStatus(soilMoisture).label}
              </span>
              <input
                type="number"
                min="10"
                max="90"
                value={soilMoisture}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) onMoistureChange(Math.min(90, Math.max(10, val)));
                }}
                className="w-16 glass-panel rounded-xl px-2 py-1 text-center font-mono font-extrabold text-sm text-sky-700 dark:text-sky-400 bg-white dark:bg-[#171C19] border border-sky-500/30 focus:outline-none focus:border-sky-400"
              />
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400">%</span>
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="90"
            value={soilMoisture}
            onChange={(e) => onMoistureChange(parseInt(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>10% (Dry)</span>
            <span className="text-sky-700 dark:text-sky-400">40 - 60% (Optimal)</span>
            <span>90% (Wet)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
