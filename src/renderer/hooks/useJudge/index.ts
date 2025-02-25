import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useJudge() {
  const [judgeResults] = useStore(useShallow((s) => [s.judgeResult]));

  const isJudgingEnd = judgeResults.length !== 0 && judgeResults.every((judgeResult) => judgeResult);
  const isJudging = judgeResults.length !== 0 && !isJudgingEnd;

  const totalCount = judgeResults.length;
  const correctCount = judgeResults.reduce(
    (prev, cur) => prev + (cur ? (cur.result === '맞았습니다!!' ? 1 : 0) : 0),
    0,
  );

  const isCorrect = totalCount === correctCount;

  return {
    isJudging,
    isJudgingEnd,
    isCorrect,

    totalCount,
    correctCount,

    judgeResults,
  };
}
