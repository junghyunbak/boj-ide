import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  customTestCase: CustomTestcases; // [ ]: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  problemHistories: ProblemInfo[]; // [ ]: problemHistories -> tabs
  setProblemHistories: (fn: (prev: ProblemInfo[]) => ProblemInfo[]) => void; // [ ]: setProblemHistories -> setTabs
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
