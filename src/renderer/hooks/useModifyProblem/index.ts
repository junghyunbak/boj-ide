import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyProblem() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const updateProblem = useCallback(
    (newProblem: ProblemInfo | null) => {
      setProblem((prev) => {
        if (!prev) {
          return newProblem;
        }

        if (prev.number !== newProblem?.number) {
          return newProblem;
        }

        if (prev.testCase.inputs.length === 0) {
          return newProblem;
        }

        prev.name = newProblem.name;
        prev.testCase = newProblem.testCase;
        prev.inputDesc = newProblem.inputDesc;

        return prev;
      });
    },
    [setProblem],
  );

  return {
    updateProblem,
  };
}
