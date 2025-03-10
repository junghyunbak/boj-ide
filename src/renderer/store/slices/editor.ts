import { type StateCreator } from 'zustand';

type EditorSlice = {
  editorWidth: number;
  setEditorWidth(width: number): void;

  editorHeight: number;
  setEditorHeight(height: number): void;

  fontSize: number;
  setFontSize: (fontSize: number) => void;

  problemToCode: Map<string | undefined, string>;
  setProblemToCode: (number: string, code: string) => void;

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

export const createEditorSlice: StateCreator<EditorSlice> = (set, get): EditorSlice => ({
  editorHeight: 0,
  setEditorHeight(height) {
    set(() => ({
      editorHeight: height,
    }));
  },

  editorWidth: 0,
  setEditorWidth(width) {
    set(() => ({ editorWidth: width }));
  },

  problemToCode: new Map(),
  setProblemToCode(number, code) {
    const { problemToCode } = get();

    problemToCode.set(number, code);
  },

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
