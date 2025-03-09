import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyTestcase() {
  const [setCustomTestcases] = useStore(useShallow((s) => [s.setCustomTestcases]));

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
      const { problem, customTestCase: customTestcases } = useStore.getState();

      const number = problem?.number;

      if (!number) {
        return;
      }

      const testcases = customTestcases[number];

      if (!testcases || !testcases[i]) {
        return;
      }

      setCustomTestcases((prev) => ({ ...prev, [number]: [...(prev[number] || []).filter((_, j) => i !== j)] }));
    },
    [setCustomTestcases],
  );

  // TODO: 테스트코드 작성
  const updateCustomTestcase = useCallback(
    (i: number, value: { input?: string; output?: string }) => {
      const { problem } = useStore.getState();

      const number = problem?.number;

      if (!number) {
        return;
      }

      setCustomTestcases((prev) => {
        if (!prev[number] || !prev[number][i]) {
          return prev;
        }

        if (value.input) {
          prev[number][i].input = value.input;
        }

        if (value.output) {
          prev[number][i].output = value.output;
        }

        return prev;
      });
    },
    [setCustomTestcases],
  );

  return {
    addCustomTestcase,
    removeCustomTestcase,
    updateCustomTestcase,
  };
}
