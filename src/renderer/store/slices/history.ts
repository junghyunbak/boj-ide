import { type StateCreator } from 'zustand';

type HistorySlice = {
  histories: ProblemInfo[];
  setHistories(fn: ((histories: ProblemInfo[]) => ProblemInfo[]) | ProblemInfo[]): void;

  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen(isOpen: boolean): void;

  historyFilterValue: string;
  setHistoryFilterValue(value: string): void;

  historyButtonRef: React.RefObject<HTMLButtonElement>;
  historyModalInputRef: React.RefObject<HTMLInputElement>;
  historyModalRef: React.RefObject<HTMLDivElement>;
};

export const createHistorySlice: StateCreator<HistorySlice> = (set, get): HistorySlice => ({
  histories: [],
  setHistories(fn) {
    set((s) => ({ histories: typeof fn === 'function' ? fn(s.histories) : fn }));
  },

  isHistoryModalOpen: false,
  setIsHistoryModalOpen(isOpen) {
    set(() => ({ isHistoryModalOpen: isOpen }));
  },

  historyFilterValue: '',
  setHistoryFilterValue(value) {
    set(() => ({ historyFilterValue: value }));
  },

  historyButtonRef: { current: null },
  historyModalRef: { current: null },
  historyModalInputRef: { current: null },
});
