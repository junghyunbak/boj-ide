import { type StateCreator } from 'zustand';

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  problemHistories: ProblemInfo[];
  addProblemHistory(problemInfo: ProblemInfo): void;
  removeProblemHistory(i: number): void;
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set): ProblemSlice => ({
  problem: null,
  setProblem(problem) {
    set(() => ({ problem }));
  },

  problemHistories: [],
  addProblemHistory(problemInfo) {
    set((s) => {
      const next = [...s.problemHistories];

      if (next.find((v) => v.number === problemInfo.number)) {
        return { problemHistories: next };
      }

      return {
        problemHistories: [...next, problemInfo],
      };
    });
  },
  removeProblemHistory(i) {
    set((s) => {
      const next = [...s.problemHistories];

      next.splice(i, 1);

      return {
        problemHistories: next,
      };
    });
  },
});
