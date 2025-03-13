import { type StateCreator } from 'zustand';

type VimSlice = {
  vimMode: string;
  setVimMode: (mode: string) => void;
};

export const createVimSlice: StateCreator<VimSlice> = (set, get): VimSlice => ({
  vimMode: 'NORMAL',
  setVimMode: (mode: string) => {
    set(() => ({ vimMode: mode }));
  },
});
