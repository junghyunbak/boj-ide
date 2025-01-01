import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

export function useProblem() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setCustomTestcases] = useStore(useShallow((s) => [s.setCustomTestcases]));

  const removeCustomTestcase = (i: number) => {
    if (!problem) {
      return;
    }

    const { number } = problem;

    setCustomTestcases((prev) => {
      const next = { ...prev };

      if (!next[number]) {
        return next;
      }

      next[number].splice(i, 1);

      return next;
    });
  };

  const addCustomTestcase = (testcase: TC, problemNumber?: string) => {
    const number = problem?.number || problemNumber;

    if (!number) {
      return;
    }

    setCustomTestcases((prev) => {
      const next = { ...prev };

      if (!next[number]) {
        next[number] = [];
      }

      next[number].push(testcase);

      return next;
    });
  };

  return {
    problem,
    addCustomTestcase,
    removeCustomTestcase,
  };
}
