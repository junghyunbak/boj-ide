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
};

export const createLayoutSlice: StateCreator<LayoutSlice> = (set): LayoutSlice => ({
  leftRatio: 50,
  setLeftRatio(leftRatio) {
    set(() => ({ leftRatio }));
  },

  topRatio: 50,
  setTopRatio(topRatio) {
    set(() => ({
      topRatio,
    }));
  },
});
