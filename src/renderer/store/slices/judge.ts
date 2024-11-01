import { type StateCreator } from 'zustand';

type JudgeSlice = {
  isJudging: boolean;
  setIsJudging(isJudging: boolean): void;

  judgeResult: (JudgeResult | undefined)[];
  setJudgeResult(fn: (prev: (JudgeResult | undefined)[]) => (JudgeResult | undefined)[]): void;
};

export const createJudgeSlice: StateCreator<JudgeSlice> = (set): JudgeSlice => ({
  isJudging: false,
  setIsJudging(isJudging) {
    set(() => ({ isJudging }));
  },

  judgeResult: [],
  setJudgeResult(fn) {
    set((s) => ({ judgeResult: fn(s.judgeResult) }));
  },
});
