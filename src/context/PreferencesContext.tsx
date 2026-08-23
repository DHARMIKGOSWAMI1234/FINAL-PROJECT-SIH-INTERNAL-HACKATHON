import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilitySettings, FarmDetails, FieldItem } from '../types';
import { StorageService } from '../services/storage';

export interface FarmerPreferences {
  defaultCrop: string;
  defaultSoilType: string;
  defaultLocation: string;
  preferredUnit: 'kg/ha' | 'kg/acre' | 'bags/acre';
}

export interface NotificationSettings {
  recommendationReminders: boolean;
  applicationReminders: boolean;
  insightUpdates: boolean;
}

interface PreferencesContextType {
  infoMode: 'simple' | 'advanced';
  setInfoMode: (mode: 'simple' | 'advanced') => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  farmer: FarmerPreferences;
  updateFarmerPrefs: (prefs: Partial<FarmerPreferences>) => void;
  notifications: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  farm: FarmDetails;
  updateFarmDetails: (details: Partial<FarmDetails>) => void;
  addField: (field: Omit<FieldItem, 'id'>) => void;
  updateField: (id: string, field: Partial<FieldItem>) => void;
  deleteField: (id: string) => void;
}

const DEFAULT_FARMER_PREFS: FarmerPreferences = {
  defaultCrop: 'wheat',
  defaultSoilType: 'Loamy',
  defaultLocation: 'Anand, Gujarat',
  preferredUnit: 'kg/ha',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  recommendationReminders: true,
  applicationReminders: true,
  insightUpdates: true,
};

const DEFAULT_FARM_DETAILS: FarmDetails = {
  farmName: 'Patel Precision Farm',
  totalFarmSize: 12.5,
  unit: 'Hectares',
  fields: [
    {
      id: 'field-1',
      name: 'North Block #1',
      area: 4.5,
      unit: 'Hectares',
      crop: 'Wheat',
      growthStage: 'Vegetative Stage',
    },
    {
      id: 'field-2',
      name: 'South Block #2',
      area: 3.0,
      unit: 'Hectares',
      crop: 'Cotton',
      growthStage: 'Flowering & Boll Formation',
    },
    {
      id: 'field-3',
      name: 'East Block #3',
      area: 5.0,
      unit: 'Hectares',
      crop: 'Mustard',
      growthStage: 'Sowing & Early Emergence',
    },
  ],
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [infoMode, setInfoModeState] = useState<'simple' | 'advanced'>(() => {
    return StorageService.getPreferences().infoMode;
  });

  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(() => {
    return StorageService.getPreferences().accessibility;
  });

  const [farmer, setFarmerState] = useState<FarmerPreferences>(() => {
    const saved = StorageService.getPreferences() as any;
    return saved.farmer ? { ...DEFAULT_FARMER_PREFS, ...saved.farmer } : DEFAULT_FARMER_PREFS;
  });

  const [notifications, setNotificationsState] = useState<NotificationSettings>(() => {
    const saved = StorageService.getPreferences() as any;
    return saved.notifications ? { ...DEFAULT_NOTIFICATIONS, ...saved.notifications } : DEFAULT_NOTIFICATIONS;
  });

  const [farm, setFarmState] = useState<FarmDetails>(() => {
    const saved = StorageService.getPreferences() as any;
    return saved.farm ? { ...DEFAULT_FARM_DETAILS, ...saved.farm } : DEFAULT_FARM_DETAILS;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (accessibility.largeTouchTargets) {
      root.classList.add('large-touch');
    } else {
      root.classList.remove('large-touch');
    }

    StorageService.savePreferences({ infoMode, accessibility, farmer, notifications, farm } as any);
  }, [infoMode, accessibility, farmer, notifications, farm]);

  const setInfoMode = (mode: 'simple' | 'advanced') => {
    setInfoModeState(mode);
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilityState((prev) => ({ ...prev, ...settings }));
  };

  const updateFarmerPrefs = (prefs: Partial<FarmerPreferences>) => {
    setFarmerState((prev) => ({ ...prev, ...prefs }));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationsState((prev) => ({ ...prev, ...settings }));
  };

  const updateFarmDetails = (details: Partial<FarmDetails>) => {
    setFarmState((prev) => ({ ...prev, ...details }));
  };

  const addField = (newFieldData: Omit<FieldItem, 'id'>) => {
    const newField: FieldItem = {
      ...newFieldData,
      id: `field-${Date.now()}`,
    };
    setFarmState((prev) => {
      const updatedFields = [...prev.fields, newField];
      const newTotalSize = updatedFields.reduce((sum, f) => sum + (Number(f.area) || 0), 0);
      return {
        ...prev,
        totalFarmSize: parseFloat(newTotalSize.toFixed(2)),
        fields: updatedFields,
      };
    });
  };

  const updateField = (id: string, updatedData: Partial<FieldItem>) => {
    setFarmState((prev) => {
      const updatedFields = prev.fields.map((f) => (f.id === id ? { ...f, ...updatedData } : f));
      const newTotalSize = updatedFields.reduce((sum, f) => sum + (Number(f.area) || 0), 0);
      return {
        ...prev,
        totalFarmSize: parseFloat(newTotalSize.toFixed(2)),
        fields: updatedFields,
      };
    });
  };

  const deleteField = (id: string) => {
    setFarmState((prev) => {
      const updatedFields = prev.fields.filter((f) => f.id !== id);
      const newTotalSize = updatedFields.reduce((sum, f) => sum + (Number(f.area) || 0), 0);
      return {
        ...prev,
        totalFarmSize: parseFloat(newTotalSize.toFixed(2)),
        fields: updatedFields,
      };
    });
  };

  return (
    <PreferencesContext.Provider
      value={{
        infoMode,
        setInfoMode,
        accessibility,
        updateAccessibility,
        farmer,
        updateFarmerPrefs,
        notifications,
        updateNotificationSettings,
        farm,
        updateFarmDetails,
        addField,
        updateField,
        deleteField,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
};

