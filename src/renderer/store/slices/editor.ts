import { type StateCreator } from 'zustand';

type EditorSlice = {
  fontSize: number;
  setFontSize: (fontSize: number) => void;

  code: string;
  setCode: (code: string) => void;

  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  lang: Language;
  setLang: (lang: Language) => void;

  isSetting: boolean;
  setIsSetting: (isSetting: boolean) => void;
};

export const createEditorSlice: StateCreator<EditorSlice> = (set): EditorSlice => ({
  fontSize: 14,
  setFontSize(fontSize) {
    set(() => ({ fontSize }));
  },

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

  isSetting: false,
  setIsSetting(isSetting) {
    set(() => ({ isSetting }));
  },
});
