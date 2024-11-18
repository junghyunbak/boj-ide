import { type StateCreator } from 'zustand';

type EditorSlice = {
  code: string;
  setCode: (code: string) => void;

  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  lang: Language;
  setLang: (lang: Language) => void;
};

export const createEditorSlice: StateCreator<EditorSlice> = (set): EditorSlice => ({
  code: '',
  setCode(code) {
    set(() => ({ code }));
  },

  mode: 'normal',
  setMode(mode) {
    set(() => ({ mode }));
  },

  lang: 'node.js',
  setLang(lang) {
    set(() => ({ lang }));
  },
});
