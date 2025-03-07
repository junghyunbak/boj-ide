import { type StateCreator } from 'zustand';

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
  setLeftRatio: (leftRatio: number) => void;

  topRatio: number;
  setTopRatio: (topRatio: number) => void;

  paintLeftRatio: number;
  setPaintLeftRatio: (ratio: number) => void;
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
});
