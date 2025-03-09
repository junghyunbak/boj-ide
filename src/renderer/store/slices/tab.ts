import { type StateCreator } from 'zustand';

type DailyProblem = [string, string[]] | null;

type TabSlice = {
  problemHistories: Tab[]; // TODO: problemHistories -> tabs
  setProblemHistories: (fn: (prev: Tab[]) => Tab[]) => void; // TODO: setProblemHistories -> setTabs

  dailyProblem: DailyProblem;
  setDailyProblem: (fn: (prev: DailyProblem) => DailyProblem) => void;

  activeDailyProblem: boolean;
  setActiveDailyProblem: (active: boolean) => void;

  destTabIndex: number | null;
  setDestTabIndex: (index: number | null) => void;

  isTabDrag: boolean;
  setIsTabDrag: (isDrag: boolean) => void;

  currentAfterImageUrl: string;
  setCurrentAfterImageUrl: (url: string) => void;
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

  destTabIndex: null,
  setDestTabIndex(index) {
    set(() => ({ destTabIndex: index }));
  },

  isTabDrag: false,
  setIsTabDrag(isDrag) {
    set(() => ({ isTabDrag: isDrag }));
  },

  currentAfterImageUrl: '',
  setCurrentAfterImageUrl(url) {
    set(() => ({ currentAfterImageUrl: url }));
  },
});
