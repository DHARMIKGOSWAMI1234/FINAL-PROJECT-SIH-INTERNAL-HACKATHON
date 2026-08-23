import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface TutorialStep {
  id: number;
  tourId: string;
  route: string;
  titleKey: string;
  descKey: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    tourId: 'welcome-banner',
    route: '/dashboard',
    titleKey: 'tutorial.step1Title',
    descKey: 'tutorial.step1Desc',
  },
  {
    id: 2,
    tourId: 'dashboard',
    route: '/dashboard',
    titleKey: 'tutorial.step2Title',
    descKey: 'tutorial.step2Desc',
  },
  {
    id: 3,
    tourId: 'fertilizer-advisor',
    route: '/dashboard',
    titleKey: 'tutorial.step3Title',
    descKey: 'tutorial.step3Desc',
  },
  {
    id: 4,
    tourId: 'soil-analysis',
    route: '/dashboard',
    titleKey: 'tutorial.step4Title',
    descKey: 'tutorial.step4Desc',
  },
  {
    id: 5,
    tourId: 'my-crops',
    route: '/dashboard',
    titleKey: 'tutorial.step5Title',
    descKey: 'tutorial.step5Desc',
  },
  {
    id: 6,
    tourId: 'fertilizer-library',
    route: '/dashboard',
    titleKey: 'tutorial.step6Title',
    descKey: 'tutorial.step6Desc',
  },
  {
    id: 7,
    tourId: 'insights',
    route: '/dashboard',
    titleKey: 'tutorial.step7Title',
    descKey: 'tutorial.step7Desc',
  },
  {
    id: 8,
    tourId: 'ai-assistant',
    route: '/dashboard',
    titleKey: 'tutorial.step8Title',
    descKey: 'tutorial.step8Desc',
  },
  {
    id: 9,
    tourId: 'history',
    route: '/dashboard',
    titleKey: 'tutorial.step9Title',
    descKey: 'tutorial.step9Desc',
  },
  {
    id: 10,
    tourId: 'settings',
    route: '/dashboard',
    titleKey: 'tutorial.step10Title',
    descKey: 'tutorial.step10Desc',
  },
  {
    id: 11,
    tourId: 'pdf-download',
    route: '/recommendation',
    titleKey: 'tutorial.step11Title',
    descKey: 'tutorial.step11Desc',
  },
];

// ── Per-user key: new accounts never inherit an old user's completion state ──
const getTutorialKey = (uid?: string) =>
  uid ? `fertilizerAI_tutorial_completed_${uid}` : 'fertilizerAI_tutorial_completed';

const getCurrentUid = (): string | undefined => {
  try {
    const raw =
      localStorage.getItem('fertilizer_ai_current_user') ||
      sessionStorage.getItem('fertilizer_ai_current_user');
    if (raw) return (JSON.parse(raw) as { uid?: string }).uid;
  } catch {
    // ignore
  }
  return undefined;
};

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: TutorialStep | null;
  isFinalStep: boolean;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isTutorialCompleted = () => {
    try {
      return localStorage.getItem(getTutorialKey(getCurrentUid())) === 'true';
    } catch {
      return false;
    }
  };

  const markCompleted = () => {
    try {
      localStorage.setItem(getTutorialKey(getCurrentUid()), 'true');
    } catch {
      // ignore
    }
  };

  // Auto-start for first-time user on their first dashboard visit
  useEffect(() => {
    if (location.pathname === '/dashboard' && !isTutorialCompleted()) {
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 900);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const startTour = useCallback(() => {
    const atDashboard = location.pathname === '/dashboard';
    if (!atDashboard) navigate('/dashboard');
    setTimeout(
      () => {
        setIsActive(true);
        setCurrentStepIndex(0);
      },
      atDashboard ? 0 : 400
    );
  }, [location.pathname, navigate]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    markCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishTour = useCallback(() => {
    setIsActive(false);
    markCompleted();
    if (location.pathname !== '/dashboard') navigate('/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skipTour();
      else if (e.key === 'ArrowRight') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isActive, nextStep, prevStep, skipTour]);

  const totalSteps = TUTORIAL_STEPS.length;
  const isFinalStep = currentStepIndex >= totalSteps;
  const currentStep = currentStepIndex < totalSteps ? TUTORIAL_STEPS[currentStepIndex] : null;

  // Auto-navigate to step's target route if needed
  useEffect(() => {
    if (isActive && currentStep && currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [isActive, currentStep, location.pathname, navigate]);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        totalSteps,
        currentStep,
        isFinalStep,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        finishTour,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error('useTutorial must be used within TutorialProvider');
  return context;
};

