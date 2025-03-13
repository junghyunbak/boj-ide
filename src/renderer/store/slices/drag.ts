import { type StateCreator } from 'zustand';

type DragSlice = {
  isResizerDrag: boolean;
  setIsResizerDrag(isDrag: boolean): void;
};

export const createDragSlice: StateCreator<DragSlice> = (set, get): DragSlice => ({
  isResizerDrag: false,
  setIsResizerDrag(isDrag) {
    set(() => ({ isResizerDrag: isDrag }));
  },
});
