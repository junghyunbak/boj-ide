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

  isCodeStale: boolean;
  setIsCodeStale: (isCodeStale: boolean) => void;

  indentSpace: IndentSpace;
  setIndentSpace: (count: IndentSpace) => void;

  isPaintOpen: boolean;
  setIsPaintOpen: (isOpen: boolean) => void;

  vimMode: string;
  setVimMode: (mode: string) => void;
};

export const createEditorSlice: StateCreator<EditorSlice> = (set): EditorSlice => ({
  vimMode: 'NORMAL',
  setVimMode: (mode: string) => {
    set(() => ({ vimMode: mode }));
  },

  isPaintOpen: false,
  setIsPaintOpen(isOpen) {
    set(() => ({ isPaintOpen: isOpen }));
  },

  isCodeStale: false,
  setIsCodeStale(isCodeStale) {
    set(() => ({ isCodeStale }));
  },

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

  indentSpace: 2,
  setIndentSpace(count) {
    set(() => ({ indentSpace: count }));
  },
});
