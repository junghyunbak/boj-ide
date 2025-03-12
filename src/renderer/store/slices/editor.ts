import { type StateCreator } from 'zustand';

type EditorSlice = {
  /**
   * editor 상태
   */
  code: string;
  setCode: (code: string) => void;

  isCodeStale: boolean;
  setIsCodeStale: (isCodeStale: boolean) => void;

  indentSpace: IndentSpace;
  setIndentSpace: (count: IndentSpace) => void;

  editorWidth: number;
  setEditorWidth(width: number): void;

  editorHeight: number;
  setEditorHeight(height: number): void;

  vimMode: string;
  setVimMode: (mode: string) => void;

  /**
   * editor 값
   */
  editorValue: Map<string | undefined, string>;

  /**
   * 적절하지 않은 slice에 존재하는 상태들
   */
  isSetting: boolean;
  setIsSetting: (isSetting: boolean) => void;

  isPaintOpen: boolean;
  setIsPaintOpen: (isOpen: boolean) => void;

  /**
   * persist 요소
   */
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  lang: Language;
  setLang: (lang: Language) => void;

  fontSize: number;
  setFontSize: (fontSize: number) => void;
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

  editorValue: new Map(),

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
