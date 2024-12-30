import { type StateCreator } from 'zustand';

type JudgeSlice = {
  // [ ]: 복수형으로 변경
  // 그냥 바꾸게 될 경우 persist의 참조가 달라져 사용자의 테스트케이스가 모두 없어져버리므로 해결한 후 수정
  judgeResult: (JudgeResult | undefined)[];
  setJudgeResult(fn: (prev: (JudgeResult | undefined)[]) => (JudgeResult | undefined)[]): void;
};

export const createJudgeSlice: StateCreator<JudgeSlice> = (set): JudgeSlice => ({
  judgeResult: [],
  setJudgeResult(fn) {
    set((s) => ({ judgeResult: fn(s.judgeResult) }));
  },
});
