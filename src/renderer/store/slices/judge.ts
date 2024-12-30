import { type StateCreator } from 'zustand';

type JudgeSlice = {
  judgeResult: (JudgeResult | undefined)[]; // TODO: judgeResult -> judgeResults
  setJudgeResult(fn: (prev: (JudgeResult | undefined)[]) => (JudgeResult | undefined)[]): void;

  judgeId: string;
  setJudgeId: (judgeId: string) => void;
};

export const createJudgeSlice: StateCreator<JudgeSlice> = (set): JudgeSlice => ({
  judgeResult: [],
  setJudgeResult(fn) {
    set((s) => ({ judgeResult: fn(s.judgeResult) }));
  },

  judgeId: '',
  setJudgeId(judgeId) {
    set((s) => ({ judgeId }));
  },
});
