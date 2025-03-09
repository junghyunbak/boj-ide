import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFetchDailyProblem } from '../useFetchDailyProblem';

export function useLoadDailyProblems() {
  const [setDailyProblem] = useStore(useShallow((s) => [s.setDailyProblem]));

  const { yyyySmmSdd, dailyProblems } = useFetchDailyProblem();

  useEffect(() => {
    if (!dailyProblems) {
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
