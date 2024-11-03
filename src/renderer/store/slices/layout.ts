import { type StateCreator } from 'zustand';

type LayoutSlice = {
  leftRatio: number;
  setLeftRatio: (leftRatio: number) => void;

  upRatio: number;
  setUpRatio: (upRatio: number) => void;
};

export const createLayoutSlice: StateCreator<LayoutSlice> = (set): LayoutSlice => ({
  leftRatio: 50,
  setLeftRatio(leftRatio) {
    set(() => ({ leftRatio }));
  },

  upRatio: 50,
  setUpRatio(upRatio) {
    set(() => ({
      upRatio,
    }));
  },
});
