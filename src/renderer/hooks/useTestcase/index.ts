import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';

export function useTestcase() {
  const [customTestcase, setCustomTestcases] = useStore(useShallow((s) => [s.customTestCase, s.setCustomTestcases]));

  const removeCustomTestcase = useCallback(
    (i: number): boolean => {
      const { problem } = useStore.getState();

      if (!problem) {
        return false;
      }

      const { number } = problem;

      const testcases = customTestcase[number];

      if (!(testcases && testcases[i])) {
        return false;
      }

      setCustomTestcases((prev) => {
        const next = { ...prev };

        if (!next[number]) {
          return next;
        }

        next[number].splice(i, 1);

        return next;
      });

      return true;
    },
    [setCustomTestcases, customTestcase],
  );

  const addCustomTestcase = useCallback(
    (testcase: TC, problemNumber?: string): boolean => {
      const { problem } = useStore.getState();

      const number = problem ? problem.number : problemNumber;

      if (!number) {
        return false;
      }

      const { lang } = useStore.getState();

      /**
       * TODO: 로깅을 위한 ipc 로직으로 인해 테스트 코드 에러 발생. 코드 위치 수정 필요.
       */
      window.electron.ipcRenderer.sendMessage('log-add-testcase', {
        data: {
          number,
          language: lang,
        },
      });

      setCustomTestcases((prev) => {
        const next = { ...prev };

        if (!next[number]) {
          next[number] = [];
        }

        next[number].push(testcase);

        return next;
      });

      return true;
    },
    [setCustomTestcases],
  );

  return {
    customTestcase,
    addCustomTestcase,
    removeCustomTestcase,
  };
}
