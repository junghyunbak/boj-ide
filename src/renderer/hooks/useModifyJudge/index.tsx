import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '../useModifyEditor';

export function useModifyJudge() {
  const [setJudgeResults] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setJudgeId] = useStore(useShallow((s) => [s.setJudgeId]));

  const { getEditorValue, saveFile } = useModifyEditor();

  const startJudge = useCallback(() => {
    const { problem, lang: language, customTestCase: customTestcases, judgeId } = useStore.getState();

    if (!problem) {
      return;
    }

    const problemTC = problem.testCase;
    const customTC = (customTestcases[problem.number] || []).reduce<{ inputs: string[]; outputs: string[] }>(
      (prev, cur) => {
        prev.inputs.push(cur.input);
        prev.outputs.push(cur.output);

        return prev;
      },
      {
        inputs: [],
        outputs: [],
      },
    );

    const inputs: string[] = [...problemTC.inputs, ...customTC.inputs];
    const outputs: string[] = [...problemTC.outputs, ...customTC.outputs];

    saveFile();

    const n = Math.min(inputs.length, outputs.length);

    setJudgeResults(() => Array(n).fill(undefined));

    window.electron.ipcRenderer.sendMessage('judge-start', {
      data: {
        code: getEditorValue(),
        language,
        number: problem.number,
        judgeId,
        testCase: {
          inputs,
          outputs,
        },
      },
    });
  }, [getEditorValue, saveFile, setJudgeResults]);

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
