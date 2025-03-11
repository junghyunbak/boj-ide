import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFetchDailyProblem } from '../useFetchDailyProblem';

export function useSetupDailyProblems() {
  const [setDailyProblem] = useStore(useShallow((s) => [s.setDailyProblem]));

  const data = useFetchDailyProblem();

  useEffect(() => {
    if (!data) {
      return;
    }

    setDailyProblem((prev) => {
      const { date, problemNumbers } = data;

      if (!prev) {
        return [date, problemNumbers];
      }

      if (prev[0] !== date) {
        return [date, problemNumbers];
      }

      return prev;
    });
  }, [data, setDailyProblem]);
}
