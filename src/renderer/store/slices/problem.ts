import { type StateCreator } from 'zustand';

type CustomTestcases = Record<string, TC[] | undefined>;
type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

type ProblemSlice = {
  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  customTestCase: CustomTestcases; // TODO: customTestCase -> customTestcases
  setCustomTestcases: (fn: (prev: CustomTestcases) => CustomTestcases) => void;

  problemHistories: ProblemInfo[]; // TODO: problemHistories -> tabs
  setProblemHistories: (fn: (prev: ProblemInfo[]) => ProblemInfo[]) => void; // TODO: setProblemHistories -> setTabs

  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;
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

  problemToFabricJSON: {},
  setProblemToFabricJSON(fn) {
    set((s) => ({ problemToFabricJSON: fn(s.problemToFabricJSON) }));
  },
});
