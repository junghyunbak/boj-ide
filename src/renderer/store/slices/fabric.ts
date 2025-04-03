import { type StateCreator } from 'zustand';
import defaultFabricData from './defaultFabricData.json';

type ProblemToFabricJSON = Partial<Record<string, ReturnType<fabric.StaticCanvas['toJSON']>>>;

type FabricSlice = {
  problemToFabricJSON: ProblemToFabricJSON;
  setProblemToFabricJSON: (fn: (prev: ProblemToFabricJSON) => ProblemToFabricJSON) => void;
};

export const createFabricSlice: StateCreator<FabricSlice> = (set, get): FabricSlice => ({
  problemToFabricJSON: {
    // @ts-ignore
    '1000': defaultFabricData,
  },
  setProblemToFabricJSON(fn) {
    set((s) => ({ problemToFabricJSON: fn(s.problemToFabricJSON) }));
  },
});
