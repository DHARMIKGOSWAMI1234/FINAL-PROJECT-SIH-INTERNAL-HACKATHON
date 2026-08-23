import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { useTutorial } from '../context/TutorialContext';
import { useToast } from '../context/ToastContext';
import { StorageService } from '../services/storage';
import { MOCK_CROPS } from '../data/crops';
import { GlassCard } from '../components/common/GlassCard';
import { FieldItem } from '../types';
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  Sprout,
  Sliders,
  MapPin,
  Scale,
  Bell,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Tractor,
  Layers,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { startTour } = useTutorial();
  const {
    farmer,
    updateFarmerPrefs,
    notifications,
    updateNotificationSettings,
    farm,
    updateFarmDetails,
    addField,
    updateField,
    deleteField,
  } = usePreferences();
  const { showToast } = useToast();

  // Field modal state
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState<{
    name: string;
    area: number;
    unit: string;
    crop: string;
    growthStage: string;
  }>({
    name: '',
    area: 1.0,
    unit: 'Hectares',
    crop: 'Wheat',
    growthStage: 'Vegetative Stage',
  });

  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);

  const GROWTH_STAGES = [
    'Sowing & Early Emergence',
    'Vegetative Stage',
    'Tillering & Flowering',
    'Pod / Grain Filling',
    'Maturity & Harvesting',
    'Fallow / Field Preparation',
  ];

  const handleResetData = () => {
    StorageService.clearAllData();
    showToast(t('settings.storage', 'Local Storage'), t('settings.savedToast', 'Preferences and history have been reset.'), 'info');
    setTimeout(() => window.location.reload(), 600);
  };

  const handleOpenAddField = () => {
    setEditingFieldId(null);
    setFieldForm({
      name: '',
      area: 1.0,
      unit: farm.unit || 'Hectares',
      crop: MOCK_CROPS[0]?.name || 'Wheat',
      growthStage: 'Vegetative Stage',
    });
    setIsFieldModalOpen(true);
  };

  const handleOpenEditField = (field: FieldItem) => {
    setEditingFieldId(field.id);
    setFieldForm({
      name: field.name,
      area: field.area,
      unit: field.unit,
      crop: field.crop,
      growthStage: field.growthStage,
    });
    setIsFieldModalOpen(true);
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldForm.name.trim()) {
      showToast('Validation Error', 'Field name/number is required.', 'warning');
      return;
    }
    if (fieldForm.area <= 0) {
      showToast('Validation Error', 'Field area must be greater than zero.', 'warning');
      return;
    }

    if (editingFieldId) {
      updateField(editingFieldId, fieldForm);
      showToast(t('settings.farmManagement', 'Farm & Field Management'), `Field "${fieldForm.name}" updated successfully.`, 'success');
    } else {
      addField(fieldForm);
      showToast(t('settings.farmManagement', 'Farm & Field Management'), `Field "${fieldForm.name}" added successfully.`, 'success');
    }
    setIsFieldModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingFieldId) {
      const targetField = farm.fields.find((f) => f.id === deletingFieldId);
      deleteField(deletingFieldId);
      showToast(t('settings.farmManagement', 'Farm & Field Management'), `Field "${targetField?.name || 'Parcel'}" removed.`, 'info');
      setDeletingFieldId(null);
    }
  };

  return (
    <div className="pt-28 pb-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('settings.title', 'Settings & Preferences')}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
          {t('settings.subtitle', 'Manage your visual theme, language script, default field parameters, notifications, and profile details.')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Onboarding Tour Restart Button Banner */}
        <GlassCard className="border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                {t('tutorial.step1Title', 'Interactive Guided Tour')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                {t('settings.subtitle', 'Replay the step-by-step onboarding tutorial anytime to explore controls.')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              startTour();
              showToast(t('tutorial.step1Title', 'Guided Tour'), 'Starting interactive tour...', 'info');
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-black transition-all cursor-pointer shrink-0 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t('settings.restartTour', 'Restart Onboarding Tour')}</span>
          </button>
        </GlassCard>

        {/* 1. APPEARANCE SECTION */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Sun className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              1. {t('settings.appearance', 'Appearance & Visual Theme')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 rounded-2xl p-4 border transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#171C19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <Sun className="h-6 w-6 text-amber-500 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black">{t('settings.themeLight', 'Light Mode')}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Clean solid surface</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 rounded-2xl p-4 border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#171C19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <Moon className="h-6 w-6 text-violet-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black">{t('settings.themeDark', 'Dark Mode')}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Matte-black theme</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex items-center gap-3 rounded-2xl p-4 border transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#171C19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <Monitor className="h-6 w-6 text-cyan-500 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black">{t('settings.themeSystem', 'System Theme')}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Auto match device</div>
              </div>
            </button>
          </div>
        </GlassCard>

        {/* 2. LANGUAGE SECTION */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Globe className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              2. {t('settings.language', 'Application Language')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { code: 'en', title: 'English', subtitle: 'Standard English Interface' },
                { code: 'hi', title: 'हिन्दी (Hindi)', subtitle: 'भारतीय कृषि भाषा' },
                { code: 'gu', title: 'ગુજરાતી (Gujarati)', subtitle: 'પ્રાદેશિક કૃષિ ભાષા' },
              ] as const
            ).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  showToast(t('settings.language', 'Language'), `Updated to ${lang.title}`, 'info');
                }}
                className={`flex items-center gap-3 rounded-2xl p-4 border transition-all cursor-pointer ${
                  language === lang.code
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm'
                    : 'bg-slate-50 dark:bg-[#171C19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
                }`}
              >
                <Globe className="h-5 w-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-black">{lang.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{lang.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* 3. FARMER FIELD PREFERENCES */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Sprout className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              3. {t('settings.farmerPrefs', 'Farmer Field Preferences')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Default Crop */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.defaultCrop', 'Default Crop Target')}</span>
              </label>
              <select
                value={farmer.defaultCrop}
                onChange={(e) => updateFarmerPrefs({ defaultCrop: e.target.value })}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.localNames?.[language] || c.name} ({c.season})
                  </option>
                ))}
              </select>
            </div>

            {/* Default Soil Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.defaultSoil', 'Default Soil Type')}</span>
              </label>
              <select
                value={farmer.defaultSoilType}
                onChange={(e) => updateFarmerPrefs({ defaultSoilType: e.target.value })}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Loamy">Loamy Soil (Balanced)</option>
                <option value="Black">Black Cotton Soil (Clay)</option>
                <option value="Red">Red Clay Soil (Iron Rich)</option>
                <option value="Sandy">Sandy Soil (High Leaching)</option>
                <option value="Silty">Silty Soil (Riverbed)</option>
                <option value="Alluvial">Alluvial Soil (Fertile Plain)</option>
              </select>
            </div>

            {/* Default Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.defaultLocation', 'Default Location / Region')}</span>
              </label>
              <input
                type="text"
                value={farmer.defaultLocation}
                onChange={(e) => updateFarmerPrefs({ defaultLocation: e.target.value })}
                placeholder="e.g. Anand, Gujarat"
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Preferred Fertilizer Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.preferredUnit', 'Preferred Fertilizer Unit')}</span>
              </label>
              <select
                value={farmer.preferredUnit}
                onChange={(e) => updateFarmerPrefs({ preferredUnit: e.target.value as any })}
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="kg/ha">{t('settings.unitKgHa', 'Kilograms / Hectare (kg/ha)')}</option>
                <option value="kg/acre">{t('settings.unitKgAcre', 'Kilograms / Acre (kg/acre)')}</option>
                <option value="bags/acre">{t('settings.unitBagsAcre', 'Bags / Acre (bags/acre)')}</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* 4. FARM & FIELD MANAGEMENT */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                4. {t('settings.farmManagement', 'Farm & Field Management')}
              </h3>
            </div>
            <button
              onClick={handleOpenAddField}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>{t('settings.addField', 'Add Field')}</span>
            </button>
          </div>

          {/* Farm Name & Total Size Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tractor className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.farmName', 'Farm Name')}</span>
              </label>
              <input
                type="text"
                value={farm.farmName}
                onChange={(e) => updateFarmDetails({ farmName: e.target.value })}
                placeholder="e.g. Patel Agriculture Farm"
                className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#121614] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('settings.totalFarmSize', 'Total Farm Size')}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={farm.totalFarmSize}
                  onChange={(e) => updateFarmDetails({ totalFarmSize: parseFloat(e.target.value) || 0 })}
                  className="flex-1 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#121614] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={farm.unit}
                  onChange={(e) => updateFarmDetails({ unit: e.target.value })}
                  className="rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#121614] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Hectares">Hectares</option>
                  <option value="Acres">Acres</option>
                </select>
              </div>
            </div>
          </div>

          {/* Registered Fields List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-500" />
                <span>{t('settings.fieldsTitle', 'Registered Fields & Parcels')}</span>
                <span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {farm.fields.length}
                </span>
              </h4>
            </div>

            {farm.fields.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <Tractor className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                  {t('settings.noFields', 'No fields added yet. Click "Add Field" to register your first parcel.')}
                </p>
                <button
                  onClick={handleOpenAddField}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-black transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('settings.addField', 'Add Field')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farm.fields.map((field) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-xs hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{field.name}</span>
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                          {field.area} {field.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditField(field)}
                          className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          title={t('settings.editField', 'Edit Field')}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingFieldId(field.id)}
                          className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title={t('settings.deleteField', 'Delete Field')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/5 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          {t('settings.cropPlanted', 'Crop Planted')}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          🌱 {field.crop}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          {t('settings.growthStage', 'Growth Stage')}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
                          {field.growthStage}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* 5. NOTIFICATION ALERTS */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Bell className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              5. {t('settings.notifications', 'Notification Alerts')}
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t('settings.recReminders', 'Soil Analysis & Recommendation Reminders')}
              </span>
              <input
                type="checkbox"
                checked={notifications.recommendationReminders}
                onChange={(e) => updateNotificationSettings({ recommendationReminders: e.target.checked })}
                className="accent-emerald-500 h-4 w-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t('settings.appReminders', 'Fertilizer Application Stage Reminders')}
              </span>
              <input
                type="checkbox"
                checked={notifications.applicationReminders}
                onChange={(e) => updateNotificationSettings({ applicationReminders: e.target.checked })}
                className="accent-emerald-500 h-4 w-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t('settings.insightUpdates', 'Agronomic Insights & Season Updates')}
              </span>
              <input
                type="checkbox"
                checked={notifications.insightUpdates}
                onChange={(e) => updateNotificationSettings({ insightUpdates: e.target.checked })}
                className="accent-emerald-500 h-4 w-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </GlassCard>

        {/* 6. FARMER ACCOUNT PROFILE */}
        <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                6. {t('settings.account', 'Farmer Account Profile')}
              </h3>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <span>{t('settings.editProfile', 'Edit Profile Details')}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/30 shrink-0">
              RP
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Ramesh Patel</h4>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>Verified Farmer</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                ramesh.patel@agrimail.in • {farmer.defaultLocation}
              </p>
              <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>Farm: <strong className="text-slate-900 dark:text-white">{farm.farmName} ({farm.totalFarmSize} {farm.unit})</strong></span>
                <span>Fields: <strong className="text-slate-900 dark:text-white">{farm.fields.length} Registered</strong></span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* INTERACTIVE ONBOARDING TOUR */}
        <GlassCard className="border border-blue-500/30 bg-white dark:bg-[#121614] p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {t('tutorial.restartTour', 'Restart Onboarding Tour')}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {t('tutorial.restartDesc', 'Launch the interactive website onboarding tour again.')}
          </p>
          <button
            onClick={startTour}
            className="flex items-center gap-2 rounded-xl bg-blue-500/15 border border-blue-500/30 px-4 py-2.5 text-xs font-extrabold text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t('tutorial.restartTour', 'Restart Onboarding Tour')}</span>
          </button>
        </GlassCard>

        {/* 7. DATA RESET */}
        <GlassCard className="border border-rose-500/30 bg-white dark:bg-[#121614] p-6 space-y-3 shadow-sm">
          <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>7. {t('settings.storage', 'Local Storage Management')}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Clear all saved soil recommendations, saved favorites, and custom field preferences from your browser.
          </p>
          <button
            onClick={handleResetData}
            className="flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-2.5 text-xs font-extrabold text-rose-700 dark:text-rose-400 hover:bg-rose-500/25 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t('settings.clearAll', 'Reset All Stored Local Data')}</span>
          </button>
        </GlassCard>
      </div>

      {/* Add / Edit Field Modal */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="max-w-md w-full p-6 bg-white dark:bg-[#121614] border border-emerald-500/30 dark:border-white/10 shadow-2xl rounded-3xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {editingFieldId
                    ? t('settings.editField', 'Edit Field')
                    : t('settings.addField', 'Add Field')}
                </h3>
              </div>
              <button
                onClick={() => setIsFieldModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="space-y-4">
              {/* Field Name / Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('settings.fieldName', 'Field Name / Number')}
                </label>
                <input
                  type="text"
                  required
                  value={fieldForm.name}
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                  placeholder="e.g. North Parcel #1"
                  className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Field Area & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('settings.fieldArea', 'Field Area')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={fieldForm.area}
                    onChange={(e) => setFieldForm({ ...fieldForm, area: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Unit</label>
                  <select
                    value={fieldForm.unit}
                    onChange={(e) => setFieldForm({ ...fieldForm, unit: e.target.value })}
                    className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Hectares">Hectares</option>
                    <option value="Acres">Acres</option>
                  </select>
                </div>
              </div>

              {/* Crop Planted */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('settings.cropPlanted', 'Crop Planted')}
                </label>
                <select
                  value={fieldForm.crop}
                  onChange={(e) => setFieldForm({ ...fieldForm, crop: e.target.value })}
                  className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {MOCK_CROPS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.localNames?.[language] || c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Growth Stage */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('settings.growthStage', 'Current Growth Stage')}
                </label>
                <select
                  value={fieldForm.growthStage}
                  onChange={(e) => setFieldForm({ ...fieldForm, growthStage: e.target.value })}
                  className="w-full rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {GROWTH_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {t('settings.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  <Check className="h-4 w-4" />
                  <span>{t('settings.saveField', 'Save Field')}</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Delete Field Confirmation Modal */}
      {deletingFieldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="max-w-sm w-full p-6 bg-white dark:bg-[#121614] border border-rose-500/30 shadow-2xl rounded-3xl space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {t('settings.deleteField', 'Delete Field')}
              </h4>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('settings.confirmDeleteField', 'Are you sure you want to delete this field?')}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingFieldId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t('settings.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('settings.deleteField', 'Delete Field')}</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

