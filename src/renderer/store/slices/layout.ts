import { type StateCreator } from 'zustand';
import { HISTORY_MODAL_DEFAULT_HEIGHT } from '@/renderer/constants';

type LayoutSlice = {
  /**
   * main window
   * ┌─────────┬─────────┐
   * │         │   top   │
   * │  left   ├─────────┤
   * │         │         │
   * └─────────┴─────────┘
   */
  leftRatio: number;
  setLeftRatio(leftRatio: number): void;

  topRatio: number;
  setTopRatio(topRatio: number): void;

  paintLeftRatio: number;
  setPaintLeftRatio(ratio: number): void;

  historyModalHeight: number;
  setHistoryModalHeight(px: number): void;
};

export const createLayoutSlice: StateCreator<LayoutSlice> = (set): LayoutSlice => ({
  leftRatio: 40,
  setLeftRatio(leftRatio) {
    set(() => ({ leftRatio }));
  },

  topRatio: 60,
  setTopRatio(topRatio) {
    set(() => ({
      topRatio,
    }));
  },

  paintLeftRatio: 50,
  setPaintLeftRatio(ratio) {
    set(() => ({
      paintLeftRatio: ratio,
    }));
  },

  historyModalHeight: HISTORY_MODAL_DEFAULT_HEIGHT,
  setHistoryModalHeight(px) {
    set(() => ({ historyModalHeight: px }));
  },
});
