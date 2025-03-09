import { useCallback } from 'react';

import { useStore } from '@/renderer/store';

export function useModifyProblem() {
  const updateProblem = useCallback((newProblem: ProblemInfo | null) => {
    const { problem, setProblem } = useStore.getState();
    if (!newProblem) {
      setProblem(newProblem);
      return;
    }

    if (problem && problem.number === newProblem.number) {
      problem.name = newProblem.name;
      problem.testCase = newProblem.testCase;
      problem.inputDesc = newProblem.inputDesc;
      problem.testCase = newProblem.testCase;
      return;
    }

    setProblem(newProblem);
  }, []);

  return {
    updateProblem,
  };
}
