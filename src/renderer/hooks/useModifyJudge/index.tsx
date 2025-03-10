import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '../useModifyEditor';

export function useModifyJudge() {
  const [setJudgeResults] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setJudgeId] = useStore(useShallow((s) => [s.setJudgeId]));

  const { getProblemCode, saveEditorCode } = useModifyEditor();

  const startJudge = useCallback(() => {
    const { problem, customTestCase: customTestcases, judgeId } = useStore.getState();

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

    const n = Math.min(inputs.length, outputs.length);

    setJudgeResults(() => Array(n).fill(undefined));
    saveEditorCode({ silence: true });

    const { number } = problem;
    const { lang: language } = useStore.getState();
    const code = getProblemCode();

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
  }, [getProblemCode, saveEditorCode, setJudgeResults]);

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
