import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useCallback } from 'react';

export function useProblem() {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));

  const updateProblem = useCallback(
    (newProblem: ProblemInfo | null) => {
      if (!newProblem) {
        setProblem(newProblem);
        return;
      }

      if (problem && problem.number === newProblem.number) {
        problem.name = newProblem.name;
        problem.testCase = newProblem.testCase;
        problem.inputDesc = newProblem.inputDesc;
        return;
      }

      setProblem(newProblem);
    },
    [problem, setProblem],
  );

  return {
    problem,
    updateProblem,
  };
}
