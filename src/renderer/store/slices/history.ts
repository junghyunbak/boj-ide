import { HISTORY_MODAL_DEFAULT_HEIGHT } from '@/renderer/components/molecules/HistoryModal';
import { type StateCreator } from 'zustand';

type HistorySlice = {
  histories: ProblemInfo[];
  setHistories: (fn: ((histories: ProblemInfo[]) => ProblemInfo[]) | ProblemInfo[]) => void;

  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen(isOpen: boolean): void;

  historyModalHeight: number;
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

  historyModalHeight: HISTORY_MODAL_DEFAULT_HEIGHT,
});
