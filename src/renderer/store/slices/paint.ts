import { type StateCreator } from 'zustand';

type PaintSlice = {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;

  paintRef: React.RefObject<HTMLDivElement>;
};

export const createPaintSlice: StateCreator<PaintSlice> = (set, get): PaintSlice => ({
  isExpand: false,
  setIsExpand: (isExpand: boolean) => {
    set(() => ({ isExpand }));
  },

  paintRef: { current: null },
});
