import { type StateCreator } from 'zustand';

type PaintSlice = {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;

  paintRef: React.RefObject<HTMLDivElement>;
  setPaintRef: (ref: React.RefObject<HTMLDivElement>) => void;
};

export const createPaintSlice: StateCreator<PaintSlice> = (set, get): PaintSlice => ({
  isExpand: false,
  setIsExpand: (isExpand: boolean) => {
    set((s) => ({ isExpand }));
  },

  paintRef: { current: null },
  setPaintRef: (ref: React.RefObject<HTMLDivElement>) => {
    set((s) => ({ paintRef: ref }));
  },
});
