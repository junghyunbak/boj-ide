import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useCallback } from 'react';

export function useProblem() {
  const [problem, setProblem, setProblemNoRerender] = useStore(
    useShallow((s) => [s.problem, s.setProblem, s.setProblemNoRerender]),
  );

  const updateProblem = useCallback(
    (newProblem: ProblemInfo | null) => {
      if (!newProblem) {
        setProblem(newProblem);
        return;
      }

      if (problem && problem.number === newProblem.number) {
        setProblemNoRerender(newProblem);
        return;
      }

      setProblem(newProblem);
    },
    [problem, setProblem, setProblemNoRerender],
  );

  return {
    problem,
    updateProblem,
  };
}
