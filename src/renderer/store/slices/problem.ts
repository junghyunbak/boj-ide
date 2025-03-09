import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  customTestCase: CustomTestcases; // TODO: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  testcaseInputProblemNumber: string;
  setTestcaseInputProblemNumber(problemNumber: string): void;
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

  testcaseInputProblemNumber: '',
  setTestcaseInputProblemNumber(problemNumber) {
    set(() => ({ testcaseInputProblemNumber: problemNumber }));
  },
});
