import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { ApiService } from '../services/api';
import { MOCK_CROPS } from '../data/crops';
import { SoilType } from '../types';
import { StepCrop } from '../components/advisor/StepCrop';
import { StepSoil } from '../components/advisor/StepSoil';
import { StepNutrients } from '../components/advisor/StepNutrients';
import { StepEnvironment } from '../components/advisor/StepEnvironment';
import { StepReview } from '../components/advisor/StepReview';
import { StepAnalysis } from '../components/advisor/StepAnalysis';
import { MagneticButton } from '../components/common/MagneticButton';
import { ArrowLeft, ArrowRight, Sparkles, Check, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DRAFT_KEY = 'fertilizer_ai_advisor_draft';

export const AdvisorPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [searchParams] = useSearchParams();
  const { saveRecommendation } = useHistory();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);

  // Form Wizard State
  const [selectedCropId, setSelectedCropId] = useState<string>(MOCK_CROPS[0].id);
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [pH, setPH] = useState<number>(6.8);
  const [soilMoisture, setSoilMoisture] = useState<number>(45);
  const [n, setN] = useState<number>(45);
  const [p, setP] = useState<number>(25);
  const [k, setK] = useState<number>(30);
  const [temp, setTemp] = useState<number>(28);
  const [humidity, setHumidity] = useState<number>(65);
  const [rainfall, setRainfall] = useState<number>(120);
  const [fieldArea, setFieldArea] = useState<number>(2.5);
  const [location, setLocation] = useState<string>('');

  // Pre-select crop if navigated from Crop Details ("Use This Crop")
  useEffect(() => {
    const passedCropId = (routerLocation.state as { cropId?: string })?.cropId || searchParams.get('cropId');
    if (passedCropId && MOCK_CROPS.some((c) => c.id === passedCropId)) {
      setSelectedCropId(passedCropId);
      setStep(1);
    }
  }, [routerLocation, searchParams]);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.selectedCropId) setSelectedCropId(draft.selectedCropId);
        if (draft.soilType) setSoilType(draft.soilType);
        if (draft.pH !== undefined) setPH(draft.pH);
        if (draft.soilMoisture !== undefined) setSoilMoisture(draft.soilMoisture);
        if (draft.n !== undefined) setN(draft.n);
        if (draft.p !== undefined) setP(draft.p);
        if (draft.k !== undefined) setK(draft.k);
        if (draft.temp !== undefined) setTemp(draft.temp);
        if (draft.humidity !== undefined) setHumidity(draft.humidity);
        if (draft.rainfall !== undefined) setRainfall(draft.rainfall);
        if (draft.fieldArea !== undefined) setFieldArea(draft.fieldArea);
        if (draft.location !== undefined) setLocation(draft.location);
        if (draft.step && draft.step >= 1 && draft.step <= 5) setStep(draft.step);
      }
    } catch {
      // Ignore JSON parse error
    }
  }, []);

  // Save draft to localStorage whenever form state changes
  useEffect(() => {
    const draft = {
      selectedCropId,
      soilType,
      pH,
      soilMoisture,
      n,
      p,
      k,
      temp,
      humidity,
      rainfall,
      fieldArea,
      location,
      step: step <= 5 ? step : 5,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [selectedCropId, soilType, pH, soilMoisture, n, p, k, temp, humidity, rainfall, fieldArea, location, step]);

  const selectedCrop = MOCK_CROPS.find((c) => c.id === selectedCropId) || MOCK_CROPS[0];

  const handleResetDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setSelectedCropId(MOCK_CROPS[0].id);
    setSoilType('Loamy');
    setPH(6.8);
    setSoilMoisture(45);
    setN(45);
    setP(25);
    setK(30);
    setTemp(28);
    setHumidity(65);
    setRainfall(120);
    setFieldArea(2.5);
    setLocation('');
    setStep(1);
    showToast(t('advisor.resetDraft'), 'Form reset to default parameters.');
  };

  const validateCurrentStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!selectedCropId || !MOCK_CROPS.some((c) => c.id === selectedCropId)) {
        showToast('Selection Required', t('advisor.validationErrorCrop') || 'Please select a crop.', 'warning');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!soilType) {
        showToast('Selection Required', t('advisor.validationErrorSoil') || 'Please select a soil type.', 'warning');
        return false;
      }
      if (pH < 4.0 || pH > 9.5) {
        showToast('Validation Error', 'Soil pH must be between 4.0 and 9.5.', 'warning');
        return false;
      }
    }
    if (currentStep === 3) {
      if (n < 0 || p < 0 || k < 0) {
        showToast('Validation Error', 'NPK nutrient values must be non-negative numbers.', 'warning');
        return false;
      }
    }
    if (currentStep === 4) {
      if (temp < 0 || temp > 55) {
        showToast('Validation Error', 'Temperature must be between 0°C and 55°C.', 'warning');
        return false;
      }
      if (humidity < 10 || humidity > 100) {
        showToast('Validation Error', 'Humidity must be between 10% and 100%.', 'warning');
        return false;
      }
      if (rainfall < 0 || rainfall > 500) {
        showToast('Validation Error', 'Rainfall must be between 0mm and 500mm.', 'warning');
        return false;
      }
      if (fieldArea <= 0 || fieldArea > 100) {
        showToast('Validation Error', 'Field area must be between 0.1 and 100 hectares.', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(step)) return;
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleStartAnalysis = () => {
    // Validate steps 1-4 before scanning
    if (!validateCurrentStep(1) || !validateCurrentStep(2) || !validateCurrentStep(3) || !validateCurrentStep(4)) {
      return;
    }
    setStep(6); // Step 6 = AI Scanning radar view
  };

  const handleCompleteAnalysis = async () => {
    try {
      const result = await ApiService.generateRecommendation({
        cropId: selectedCropId,
        soil: { soilType, pH, soilMoisture, n, p, k },
        environment: { temperature: temp, humidity, rainfall, fieldArea, location },
        language,
      });
      result.id = `rec_${Date.now()}`;
      await saveRecommendation(result);
      localStorage.removeItem(DRAFT_KEY);
      navigate(`/recommendation/${result.id}`, { state: { result } });
    } catch (err: unknown) {
      console.error('Recommendation Generation Error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Could not compute AI fertilizer prescription. Please check your network and ensure the backend is running.';
      showToast('Analysis Error', errorMessage, 'error');
      setStep(5);
    }
  };

  const stepsList = [
    { num: 1, label: t('advisor.stepCrop') },
    { num: 2, label: t('advisor.stepSoil') },
    { num: 3, label: t('advisor.stepNutrients') },
    { num: 4, label: t('advisor.stepEnv') },
    { num: 5, label: t('advisor.stepReview') },
  ];

  return (
    <div className="pt-28 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full glass-panel px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('advisor.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('advisor.title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('advisor.subtitle')}
        </p>

        {/* Draft Notification Badge & Reset Action */}
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <Save className="h-3 w-3" />
            {t('advisor.draftSaved')}
          </span>
          <button
            onClick={handleResetDraft}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            {t('advisor.resetDraft')}
          </button>
        </div>
      </div>

      {/* Step Progress Bar (hidden during scanning animation) */}
      {step <= 5 && (
        <div className="mb-10 glass-panel rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div
                  key={s.num}
                  onClick={() => {
                    if (s.num < step || validateCurrentStep(step)) {
                      setStep(s.num);
                    }
                  }}
                  className="flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-glow-sm'
                        : isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-500/10 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      isCurrent
                        ? 'text-slate-900 dark:text-white'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.num < 5 && <div className="h-0.5 w-4 sm:w-8 bg-emerald-500/20 rounded hidden sm:block" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Step Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden bg-white/90 dark:bg-[#121614]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div>
              {step === 1 && (
                <StepCrop selectedCropId={selectedCropId} onSelectCrop={setSelectedCropId} />
              )}

              {step === 2 && (
                <StepSoil
                  selectedSoilType={soilType}
                  onSelectSoilType={setSoilType}
                  pH={pH}
                  onPhChange={setPH}
                  soilMoisture={soilMoisture}
                  onMoistureChange={setSoilMoisture}
                />
              )}

              {step === 3 && (
                <StepNutrients
                  crop={selectedCrop}
                  n={n}
                  p={p}
                  k={k}
                  onChangeN={setN}
                  onChangeP={setP}
                  onChangeK={setK}
                />
              )}

              {step === 4 && (
                <StepEnvironment
                  temperature={temp}
                  humidity={humidity}
                  rainfall={rainfall}
                  fieldArea={fieldArea}
                  location={location}
                  onChangeTemp={setTemp}
                  onChangeHumidity={setHumidity}
                  onChangeRainfall={setRainfall}
                  onChangeFieldArea={setFieldArea}
                  onChangeLocation={setLocation}
                />
              )}

              {step === 5 && (
                <StepReview
                  crop={selectedCrop}
                  soilType={soilType}
                  pH={pH}
                  soilMoisture={soilMoisture}
                  n={n}
                  p={p}
                  k={k}
                  temp={temp}
                  humidity={humidity}
                  rainfall={rainfall}
                  fieldArea={fieldArea}
                  location={location}
                  onEditStep={(targetStep) => setStep(targetStep)}
                  onAnalyze={handleStartAnalysis}
                />
              )}

              {step === 6 && <StepAnalysis onComplete={handleCompleteAnalysis} />}
            </div>

            {/* Navigation Buttons (Steps 1 to 4) */}
            {step < 5 && (
              <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('advisor.btnBack')}</span>
                </button>

                <MagneticButton size="md" variant="primary" onClick={handleNext}>
                  <span>{t('advisor.btnNext')}</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
