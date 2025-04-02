import { type StateCreator } from 'zustand';

type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

type FabricSlice = {
  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;
};

export const createFabricSlice: StateCreator<FabricSlice> = (set, get): FabricSlice => ({
  problemToFabricJSON: {},
  setProblemToFabricJSON(fn) {
    set((s) => ({ problemToFabricJSON: fn(s.problemToFabricJSON) }));
  },
});
