import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;

type Problem = ProblemInfo | null;

type ProblemSlice = {
  problem: Problem;
  setProblem(fn: ((problem: Problem) => Problem) | Problem): void;

  customTestCase: CustomTestcases; // TODO: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  testcaseInputProblemNumber: string;
  setTestcaseInputProblemNumber(problemNumber: string): void;
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set, get): ProblemSlice => ({
  problem: null,
  setProblem(fn) {
    set((s) => ({ problem: typeof fn === 'function' ? fn(s.problem) : fn }));
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
