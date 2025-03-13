import { type StateCreator } from 'zustand';

type DragSlice = {
  isResizerDrag: boolean;
  setIsResizerDrag(isDrag: boolean): void;

  isTabDrag: boolean;
  setIsTabDrag(isDrag: boolean): void;

  destTabIndex: number | null;
  setDestTabIndex(index: number | null): void;
};

export const createDragSlice: StateCreator<DragSlice> = (set, get): DragSlice => ({
  isResizerDrag: false,
  setIsResizerDrag(isDrag) {
    set(() => ({ isResizerDrag: isDrag }));
  },

  isTabDrag: false,
  setIsTabDrag(isDrag) {
    set(() => ({ isTabDrag: isDrag }));
  },

  destTabIndex: null,
  setDestTabIndex(index) {
    set(() => ({ destTabIndex: index }));
  },
});
