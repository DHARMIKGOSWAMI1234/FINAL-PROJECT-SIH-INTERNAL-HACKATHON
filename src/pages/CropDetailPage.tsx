import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiService } from '../services/api';
import { Crop } from '../types';
import { CropDetails } from '../components/crops/CropDetails';
import { Sprout, ArrowLeft } from 'lucide-react';

export const CropDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id, cropId } = useParams<{ id?: string; cropId?: string }>();
  const activeId = id || cropId;
  const navigate = useNavigate();

  const [crop, setCrop] = useState<Crop | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (activeId) {
      setIsLoading(true);
      ApiService.getCrop(activeId)
        .then((res) => {
          if (res) setCrop(res);
        })
        .finally(() => setIsLoading(false));
    }
  }, [activeId]);

  if (isLoading) {
    return (
      <div className="pt-36 pb-20 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Loading crop intelligence profile...</p>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="pt-36 pb-20 max-w-xl mx-auto text-center px-4 space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
          <Sprout className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('cropDetail.notFoundTitle', 'Crop Profile Not Found')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('cropDetail.notFoundDesc', 'The requested crop profile could not be located in our agricultural database.')}
        </p>
        <button
          onClick={() => navigate('/crops')}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow-sm hover:bg-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('cropDetail.backToCrops', 'Back to Crops Database')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <CropDetails crop={crop} />
    </div>
  );
};
