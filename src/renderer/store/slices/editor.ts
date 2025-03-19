import { type EditorState } from '@codemirror/state';
import { type EditorView } from '@codemirror/view';
import { type StateCreator } from 'zustand';

type EditorSlice = {
  /**
   * editor 상태
   */

  editorState: EditorState | undefined;
  updateEditorState(editorState: EditorState | undefined): void;

  editorView: EditorView | undefined;
  updateEditorView(editorView: EditorView | undefined): void;

  indentSpace: IndentSpace;
  setIndentSpace: (count: IndentSpace) => void;

  problemToStale: Map<string, boolean>;
  setProblemToStale: (key: string, value: boolean) => void;

  /**
   * editor 값
   */
  editorValue: Map<string | undefined, string | null>;

  editorRef: React.RefObject<HTMLDivElement>;

  /**
   * 적절하지 않은 slice에 존재하는 상태들
   */
  isSetting: boolean;
  setIsSetting: (isSetting: boolean) => void;

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
  editorValue: new Map(),

  problemToStale: new Map(),
  setProblemToStale(key, value) {
    set((s) => {
      const nextProblemToStale = new Map(s.problemToStale.entries());

      nextProblemToStale.set(key, value);

      return {
        problemToStale: nextProblemToStale,
      };
    });
  },

  fontSize: 14,
  setFontSize(fontSize) {
    set(() => ({ fontSize }));
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

  editorRef: { current: null },

  editorState: undefined,
  updateEditorState(editorState) {
    set(() => ({ editorState }));
  },

  editorView: undefined,
  updateEditorView(editorView) {
    set(() => ({ editorView }));
  },
});
