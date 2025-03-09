import { type StateCreator } from 'zustand';

type YYYYMMDD = string;
type ProblemNumber = ProblemInfo['number'];

type GhostTabs = Record<YYYYMMDD, ProblemNumber[]>;

type TabSlice = {
  problemHistories: Tab[]; // TODO: problemHistories -> tabs
  setProblemHistories: (fn: (prev: Tab[]) => Tab[]) => void; // TODO: setProblemHistories -> setTabs

  ghostTabs: GhostTabs;
  setGhostTabs: (fn: (prev: GhostTabs) => GhostTabs) => void;

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

  ghostTabs: {},
  setGhostTabs(fn) {
    set((s) => ({ ghostTabs: fn(s.ghostTabs) }));
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
