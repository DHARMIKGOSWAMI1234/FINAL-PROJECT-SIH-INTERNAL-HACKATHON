import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../common/GlassCard';
import { Sprout, Plus } from 'lucide-react';

interface CropItem {
  id: string;
  name: string;
  season: string;
  image: string;
  soilType: string;
}

interface MyCropsOverviewProps {
  crops: CropItem[];
}

export const MyCropsOverview: React.FC<MyCropsOverviewProps> = ({ crops }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <GlassCard className="p-6 sm:p-7 rounded-[28px] bg-[#E4E5EE] dark:bg-[#121614] border border-black/5 dark:border-white/10 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 font-bold border border-amber-500/20">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-warmwhite leading-none">
              {t('dashboard.myCropsTitle')}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-mutedgray mt-1 block">
              {t('dashboard.activeCropsSub')}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/crops')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('dashboard.addCrop')}</span>
        </button>
      </div>

      {/* Grid of Saved Crops */}
      {crops.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 dark:text-mutedgray">
          {t('dashboard.emptyCrops')}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => navigate(`/crops`)}
              className="group relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="h-28 w-full relative">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
                  <div className="text-xs font-black text-white truncate">{crop.name}</div>
                  <div className="text-[10px] text-slate-300 truncate">{crop.season}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
