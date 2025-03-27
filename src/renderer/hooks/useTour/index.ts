import { useMemo } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useTour() {
  const [tourStep] = useStore(useShallow((s) => [s.tourStep]));

  const MAX_TOUR_STEP = useMemo(() => 8, []);

  const isFirstStep = tourStep === 1;
  const isLastStep = tourStep === MAX_TOUR_STEP;

  return {
    isFirstStep,
    isLastStep,
    tourStep,
    MAX_TOUR_STEP,
  };
}
