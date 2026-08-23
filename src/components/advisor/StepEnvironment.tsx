import React from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Droplets, CloudRain, MapPin, Maximize2 } from 'lucide-react';

interface StepEnvironmentProps {
  temperature: number;
  humidity: number;
  rainfall: number;
  fieldArea: number;
  location?: string;
  onChangeTemp: (val: number) => void;
  onChangeHumidity: (val: number) => void;
  onChangeRainfall: (val: number) => void;
  onChangeFieldArea: (val: number) => void;
  onChangeLocation?: (val: string) => void;
}

export const StepEnvironment: React.FC<StepEnvironmentProps> = ({
  temperature,
  humidity,
  rainfall,
  fieldArea,
  location = '',
  onChangeTemp,
  onChangeHumidity,
  onChangeRainfall,
  onChangeFieldArea,
  onChangeLocation,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.envTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
          {t('advisor.envDesc')}
        </p>
      </div>

      {/* Climate Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Temperature (°C) — Yellow/Amber Accent */}
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5 dark:bg-[#121614] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
                <Thermometer className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {t('advisor.tempLabel')}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Ambient</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max="45"
                value={temperature}
                onChange={(e) => onChangeTemp(Math.min(45, Math.max(5, parseInt(e.target.value) || 5)))}
                className="w-14 glass-panel rounded-xl px-1.5 py-1 text-center font-mono font-black text-xs text-amber-700 dark:text-amber-400 bg-white dark:bg-[#171C19] border border-amber-500/40 focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">°C</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            value={temperature}
            onChange={(e) => onChangeTemp(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>5°C</span>
            <span className="text-amber-700 dark:text-amber-400">Target: 25°C</span>
            <span>45°C</span>
          </div>
        </div>

        {/* Humidity (%) — Blue Accent */}
        <div className="glass-panel rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5 dark:bg-[#121614] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {t('advisor.humidityLabel')}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Relative</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="20"
                max="100"
                value={humidity}
                onChange={(e) => onChangeHumidity(Math.min(100, Math.max(20, parseInt(e.target.value) || 20)))}
                className="w-14 glass-panel rounded-xl px-1.5 py-1 text-center font-mono font-black text-xs text-blue-700 dark:text-blue-400 bg-white dark:bg-[#171C19] border border-blue-500/40 focus:outline-none focus:border-blue-400"
              />
              <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">%</span>
            </div>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={humidity}
            onChange={(e) => onChangeHumidity(parseInt(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>20%</span>
            <span className="text-blue-700 dark:text-blue-400">Target: 60%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Rainfall (mm) — Cyan Accent */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-cyan-500/5 dark:bg-[#121614] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-400">
                <CloudRain className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {t('advisor.rainfallLabel')}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Seasonal</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="10"
                max="300"
                value={rainfall}
                onChange={(e) => onChangeRainfall(Math.min(300, Math.max(10, parseInt(e.target.value) || 10)))}
                className="w-16 glass-panel rounded-xl px-1 py-1 text-center font-mono font-black text-xs text-cyan-700 dark:text-cyan-400 bg-white dark:bg-[#171C19] border border-cyan-500/40 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-xs text-cyan-700 dark:text-cyan-400 font-bold">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            value={rainfall}
            onChange={(e) => onChangeRainfall(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>10mm</span>
            <span className="text-cyan-700 dark:text-cyan-400">Target: 100mm</span>
            <span>300mm</span>
          </div>
        </div>

        {/* Field Area (ha) — Purple Accent */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-purple-500/5 dark:bg-[#121614] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-400">
                <Maximize2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Field Parcel Area
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Total Size</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={fieldArea}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onChangeFieldArea(Math.min(50, Math.max(0.5, val)));
                }}
                className="w-16 glass-panel rounded-xl px-1 py-1 text-center font-mono font-black text-xs text-purple-700 dark:text-purple-400 bg-white dark:bg-[#171C19] border border-purple-500/40 focus:outline-none focus:border-purple-400"
              />
              <span className="text-xs text-purple-700 dark:text-purple-400 font-bold">ha</span>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.5"
            value={fieldArea}
            onChange={(e) => onChangeFieldArea(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">
            <span>0.5 ha</span>
            <span className="text-purple-700 dark:text-purple-400">Parcel: {fieldArea} ha</span>
            <span>50 ha</span>
          </div>
        </div>
      </div>

      {/* Location / Region Input */}
      <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 dark:border-white/10 space-y-2 bg-white/90 dark:bg-[#121614] shadow-sm">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('advisor.locationLabel')}</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => onChangeLocation?.(e.target.value)}
          placeholder={t('advisor.locationPlaceholder')}
          className="w-full glass-panel rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-white dark:bg-[#171C19] focus:outline-none focus:border-emerald-500 border border-emerald-500/30 font-medium"
        />
      </div>
    </div>
  );
};
