import { type StateCreator } from 'zustand';

type ProblemSlice = {
  problem: ProblemInfo;
  setProblem(problem: ProblemInfo): void;
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set): ProblemSlice => ({
  problem: null,
  setProblem(problem) {
    set(() => ({ problem }));
  },
});
