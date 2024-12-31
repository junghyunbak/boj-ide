import { type StateCreator } from 'zustand';

type TabSlice = {
  destIndex: number | null;
  setTargetIndex: (index: number | null) => void;

  isTabDrag: boolean;
  setIsTabDrag: (isDrag: boolean) => void;

  currentAfterImageUrl: string;
  setCurrentAfterImageUrl: (url: string) => void;
};

export const createTabSlice: StateCreator<TabSlice> = (set): TabSlice => ({
  destIndex: null,
  setTargetIndex(index) {
    set(() => ({ destIndex: index }));
  },

  isTabDrag: false,
  setIsTabDrag(isDrag) {
    set(() => ({ isTabDrag: isDrag }));
  },

  currentAfterImageUrl: '',
  setCurrentAfterImageUrl(url) {
    set(() => ({ currentAfterImageUrl: url }));
  },
});
