import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;
  setProblemNoRerender(problem: ProblemInfo | null): void;

  customTestCase: CustomTestcases; // TODO: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  problemHistories: ProblemInfo[]; // TODO: problemHistories -> tabs
  setProblemHistories: (fn: (prev: ProblemInfo[]) => ProblemInfo[]) => void; // TODO: setProblemHistories -> setTabs
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set, get): ProblemSlice => ({
  problem: null,
  setProblem(problem) {
    set(() => ({ problem }));
  },
  setProblemNoRerender(problem) {
    const state = get();

    if (!state.problem || !problem) {
      return;
    }

    state.problem.number = problem.number;
    state.problem.name = problem.name;
    state.problem.testCase = problem.testCase;
    state.problem.inputDesc = problem.inputDesc;
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
