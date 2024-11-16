import { type StateCreator } from 'zustand';

type ProblemSlice = {
  customTestCase: Record<string, TC[] | undefined>;
  addCustomTestCase(number: string, tc: TC): void;
  removeCustomTestCase(number: string, i: number): void;

  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  problemHistories: ProblemInfo[];
  addProblemHistory(problemInfo: ProblemInfo): void;
  removeProblemHistory(i: number): void;
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set): ProblemSlice => ({
  customTestCase: {},
  addCustomTestCase(number, tc) {
    set((s) => {
      const next = {
        ...s.customTestCase,
      };

      if (!next[number]) {
        next[number] = [];
      }

      next[number].push(tc);

      return {
        customTestCase: next,
      };
    });
  },
  removeCustomTestCase(number, i) {
    set((s) => {
      const next = {
        ...s.customTestCase,
      };

      if (!next[number]) {
        return {
          customTestCase: next,
        };
      }

      next[number].splice(i, 1);

      return {
        customTestCase: next,
      };
    });
  },

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
