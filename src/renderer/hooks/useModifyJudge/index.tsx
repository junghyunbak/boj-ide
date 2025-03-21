import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '../useModifyEditor';

export function useModifyJudge() {
  const [setJudgeResults] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setJudgeId] = useStore(useShallow((s) => [s.setJudgeId]));

  const { getEditorValue } = useModifyEditor();

  const startJudge = useCallback(
    (problem: Problem, language: Language, testcases: TC[], judgeId: string) => {
      if (!problem) {
        return;
      }

      const inputs = testcases.map((tc) => tc.input);
      const outputs = testcases.map((tc) => tc.output);

      setJudgeResults(() => Array(testcases.length).fill(undefined));

      const code = getEditorValue(problem, language) || '';

      const { number } = problem;

      window.electron.ipcRenderer.sendMessage('judge-start', {
        data: {
          code,
          language,
          number,
          judgeId,
          testCase: {
            inputs,
            outputs,
          },
        },
      });
    },
    [getEditorValue, setJudgeResults],
  );

  const resetJudge = useCallback(() => {
    setJudgeResults(() => []);
  }, [setJudgeResults]);

  const updateJudgeIdentifier = useCallback(() => {
    setJudgeId(uuidv4());
  }, [setJudgeId]);

  return {
    startJudge,
    resetJudge,
    updateJudgeIdentifier,
  };
}
