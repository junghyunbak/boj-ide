import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';

export function useTestcase() {
  const [customTestcase, setCustomTestcases] = useStore(useShallow((s) => [s.customTestCase, s.setCustomTestcases]));

  const addCustomTestcase = useCallback(
    (testcase: TC, problemNumber?: string) => {
      const { problem } = useStore.getState();

      const number = problem?.number || problemNumber;

      if (!number) {
        return;
      }

      setCustomTestcases((prev) => ({ ...prev, [number]: [...(prev[number] || []), testcase] }));
    },
    [setCustomTestcases],
  );

  const removeCustomTestcase = useCallback(
    (i: number) => {
      const { problem } = useStore.getState();

      const number = problem?.number;

      if (!number) {
        return;
      }

      const testcases = customTestcase[number];

      if (!testcases || !testcases[i]) {
        return;
      }

      setCustomTestcases((prev) => ({ ...prev, [number]: [...(prev[number] || []).filter((_, j) => i !== j)] }));
    },
    [setCustomTestcases, customTestcase],
  );

  return {
    customTestcase,
    addCustomTestcase,
    removeCustomTestcase,
  };
}
