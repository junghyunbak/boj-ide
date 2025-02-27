import { type StateCreator } from 'zustand';

export type Themes = 'baekjoon' | 'programmers';

type ThemeSlice = {
  theme: Themes;
  setTheme: (theme: Themes) => void;
};

export const createThemeSlice: StateCreator<ThemeSlice> = (set, get): ThemeSlice => ({
  theme: 'baekjoon',
  setTheme(theme) {
    set(() => ({ theme }));
  },
});
