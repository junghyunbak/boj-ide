import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useTestcase } from '../useTestcase';

export function useJudge() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [judgeResults] = useStore(useShallow((s) => [s.judgeResult]));

  const { customTestcases } = useTestcase();

  const isJudgingEnd = judgeResults.length !== 0 && judgeResults.every((judgeResult) => judgeResult);
  const isJudging = judgeResults.length !== 0 && !isJudgingEnd;

  const totalCount = judgeResults.length;
  const correctCount = judgeResults.reduce(
    (prev, cur) => prev + (cur ? (cur.result === '맞았습니다!!' ? 1 : 0) : 0),
    0,
  );

  const isCorrect = totalCount === correctCount;

  const allTestcase = ((): TC[] => {
    if (!problem) {
      return [];
    }

    const tmp: TC[] = [];

    for (let i = 0; i < problem.testCase.inputs.length; i += 1) {
      tmp.push({
        input: problem.testCase.inputs[i],
        output: problem.testCase.outputs[i],
        type: 'problem',
      });
    }

    tmp.push(...(customTestcases[problem.number] || []));

    return tmp;
  })();

  return {
    isJudging,
    isJudgingEnd,
    isCorrect,

    totalCount,
    correctCount,

    judgeResults,
    allTestcase,
  };
}
