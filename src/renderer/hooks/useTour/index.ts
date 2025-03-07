import { useCallback, useMemo } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useTour() {
  const [tourStep, setTourStep] = useStore(useShallow((s) => [s.tourStep, s.setTourStep]));

  const MAX_TOUR_STEP = useMemo(() => 7, []);

  const isFirstStep = tourStep === 1;
  const isLastStep = tourStep === MAX_TOUR_STEP;

  const goPrevStep = useCallback(() => {
    if (isFirstStep) {
      return;
    }

    setTourStep(tourStep - 1);
  }, [isFirstStep, tourStep, setTourStep]);

  const goNextStep = useCallback(() => {
    setTourStep(tourStep + 1);
  }, [tourStep, setTourStep]);

  const closeTourStep = useCallback(() => {
    setTourStep(Infinity);
  }, [setTourStep]);

  const openTourStep = useCallback(() => {
    setTourStep(1);
  }, [setTourStep]);

  return {
    goPrevStep,
    goNextStep,
    closeTourStep,
    openTourStep,
    isFirstStep,
    isLastStep,
    tourStep,
    MAX_TOUR_STEP,
  };
}
