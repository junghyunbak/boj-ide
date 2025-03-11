import { useCallback } from 'react';

import { useStore } from '@/renderer/store';

export function useModifyDailyProblems() {
  const removeDailyProblemTab = useCallback((removeProblem: string) => {
    const { setDailyProblem } = useStore.getState();

    setDailyProblem((prev) => {
      if (!prev) {
        return prev;
      }

      return [prev[0], prev[1].filter((problem) => problem !== removeProblem)];
    });
  }, []);

  const toggleActiveDailyProblem = useCallback(() => {
    const { activeDailyProblem, setActiveDailyProblem } = useStore.getState();

    setActiveDailyProblem(!activeDailyProblem);
  }, []);

  return { removeDailyProblemTab, toggleActiveDailyProblem };
}
