import { type StateCreator } from 'zustand';

type DailyProblem = [string, string[]] | null;

type TabSlice = {
  /**
   * // TODO: problemHistories -> tabs
   * // TODO: setProblemHistories -> setTabs
   */
  problemHistories: Tab[];
  setProblemHistories(fn: (prev: Tab[]) => Tab[]): void;

  /**
   * 데일리 문제 탭
   */
  dailyProblem: DailyProblem;
  setDailyProblem(fn: (prev: DailyProblem) => DailyProblem): void;

  activeDailyProblem: boolean;
  setActiveDailyProblem(active: boolean): void;
};

export const createTabSlice: StateCreator<TabSlice> = (set): TabSlice => ({
  problemHistories: [],
  setProblemHistories(fn) {
    set((s) => ({ problemHistories: fn(s.problemHistories) }));
  },

  dailyProblem: null,
  setDailyProblem(fn) {
    set((s) => ({ dailyProblem: fn(s.dailyProblem) }));
  },

  activeDailyProblem: true,
  setActiveDailyProblem(active) {
    set(() => ({ activeDailyProblem: active }));
  },
});
