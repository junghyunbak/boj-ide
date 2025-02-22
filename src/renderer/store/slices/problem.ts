import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  customTestCase: CustomTestcases; // TODO: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  problemHistories: Tab[]; // TODO: problemHistories -> tabs
  setProblemHistories: (fn: (prev: Tab[]) => Tab[]) => void; // TODO: setProblemHistories -> setTabs
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set, get): ProblemSlice => ({
  problem: null,
  setProblem(problem) {
    set(() => ({ problem }));
  },

  customTestCase: {},
  setCustomTestcases(fn) {
    set((s) => ({ customTestCase: fn(s.customTestCase) }));
  },

  problemHistories: [],
  setProblemHistories(fn) {
    set((s) => ({ problemHistories: fn(s.problemHistories) }));
  },
});
