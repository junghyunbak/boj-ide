import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyTour() {
  const [setTourStep] = useStore(useShallow((s) => [s.setTourStep]));

  const goPrevStep = useCallback(() => {
    const { tourStep } = useStore.getState();

    if (tourStep === 1) {
      return;
    }

    setTourStep(tourStep - 1);
  }, [setTourStep]);

  const goNextStep = useCallback(() => {
    const { tourStep } = useStore.getState();

    setTourStep(tourStep + 1);
  }, [setTourStep]);

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
  };
}
