import { type StateCreator } from 'zustand';

type StaleSlice = {
  problemToStale: Map<string, boolean>;
  setProblemToStale: (key: string, value: boolean) => void;
};

export const createStaleSlice: StateCreator<StaleSlice> = (set, get): StaleSlice => ({
  problemToStale: new Map(),
  setProblemToStale(key, value) {
    set((s) => {
      const nextProblemToStale = new Map(s.problemToStale.entries());

      nextProblemToStale.set(key, value);

      return {
        problemToStale: nextProblemToStale,
      };
    });
  },
});
