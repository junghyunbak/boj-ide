import { BOJ_DOMAIN } from '@/constants';
import { type StateCreator } from 'zustand';

type BojViewSlice = {
  url: string;
  setUrl: (url: string) => void;

  isDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;
};

export const createBojViewSlice: StateCreator<BojViewSlice> = (set): BojViewSlice => ({
  isDrag: false,
  setIsDrag(isDrag) {
    set(() => ({
      isDrag,
    }));
  },
  url: `https://${BOJ_DOMAIN}/problemset`,
  setUrl: (url: string) => {
    set(() => ({ url }));
  },
});
