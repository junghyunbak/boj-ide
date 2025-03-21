import { type StateCreator } from 'zustand';

type LanguageSlice = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export const createLanguageSlice: StateCreator<LanguageSlice> = (set, get): LanguageSlice => ({
  lang: 'node.js',
  setLang(lang) {
    set(() => ({ lang }));
  },
});
