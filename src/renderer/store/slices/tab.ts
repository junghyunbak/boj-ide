import { type StateCreator } from 'zustand';

type TabSlice = {
  destTabIndex: number | null;
  setDestTabIndex: (index: number | null) => void;

  isTabDrag: boolean;
  setIsTabDrag: (isDrag: boolean) => void;

  currentAfterImageUrl: string;
  setCurrentAfterImageUrl: (url: string) => void;
};

export const createTabSlice: StateCreator<TabSlice> = (set): TabSlice => ({
  destTabIndex: null,
  setDestTabIndex(index) {
    set(() => ({ destTabIndex: index }));
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
