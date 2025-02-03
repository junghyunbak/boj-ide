import { useCallback, useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { v4 as uuidv4 } from 'uuid';

import { useEditorController } from '../useEditorController';

export function useJudge() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [customTestCase] = useStore(useShallow((s) => [s.customTestCase]));
  const [judgeResults, setJudgeResults] = useStore(useShallow((s) => [s.judgeResult, s.setJudgeResult]));
  const [judgeId, setJudgeId] = useStore(useShallow((s) => [s.judgeId, s.setJudgeId]));

  const { getProblemCode } = useEditorController();

  useEffect(() => {
    setJudgeId(uuidv4());
  }, [problem, customTestCase, setJudgeId]);

  const startJudge = () => {
    if (!problem) {
      return;
    }

    const problemTC = problem.testCase;
    const customTC = (customTestCase[problem.number] || []).reduce<{ inputs: string[]; outputs: string[] }>(
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
  };

  const resetJudge = useCallback(() => {
    setJudgeResults(() => []);
  }, [setJudgeResults]);

  const isJudgingEnd = judgeResults.length !== 0 && judgeResults.every((judgeResult) => judgeResult);
  const isJudging = judgeResults.length !== 0 && !isJudgingEnd;

  const totalCount = judgeResults.length;
  const correctCount = judgeResults.reduce(
    (prev, cur) => prev + (cur ? (cur.result === '맞았습니다!!' ? 1 : 0) : 0),
    0,
  );
  const isCorrect = totalCount === correctCount;

  return {
    startJudge,
    resetJudge,
    isJudging,
    isJudgingEnd,
    totalCount,
    correctCount,
    isCorrect,
    judgeResults,
    setJudgeResults,
    customTestCase,
    judgeId,
  };
}
