import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useProblem } from '../useProblem';

export function useSetupProblem() {
  const { problem } = useProblem();

  const [setTestcaseInputProblemNumber] = useStore(useShallow((s) => [s.setTestcaseInputProblemNumber]));

  useEffect(() => {
    if (problem) {
      setTestcaseInputProblemNumber(problem.number);
    }
  }, [problem, setTestcaseInputProblemNumber]);
}
