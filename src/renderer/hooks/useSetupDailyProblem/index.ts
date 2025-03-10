import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFetchDailyProblem } from '../useFetchDailyProblem';

export function useSetupDailyProblems() {
  const [setDailyProblem] = useStore(useShallow((s) => [s.setDailyProblem]));

  const { yyyySmmSdd, dailyProblems } = useFetchDailyProblem();

  useEffect(() => {
    if (!dailyProblems || dailyProblems.length === 0) {
      return;
    }

    setDailyProblem((prev) => {
      if (prev && prev[0] === yyyySmmSdd) {
        return prev;
      }

      return [yyyySmmSdd, dailyProblems];
    });
  }, [yyyySmmSdd, dailyProblems, setDailyProblem]);
}
