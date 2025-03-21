import { type EditorState } from '@codemirror/state';
import { type EditorView } from '@codemirror/view';
import { type StateCreator } from 'zustand';

type EditorValue = Partial<Record<string, { [lang in Language]?: { prev: string | null; cur: string | null } }>>;

type EditorSlice = {
  editorState: EditorState | undefined;
  updateEditorState(editorState: EditorState | undefined): void;

  editorView: EditorView | undefined;
  updateEditorView(editorView: EditorView | undefined): void;

  editorValue: EditorValue;
  setEditorValue(fn: (editorValue: EditorValue) => EditorValue): void;

  editorRef: React.RefObject<HTMLDivElement>;

  mode: EditorMode;
  updateEditorMode(mode: EditorMode): void;

  fontSize: number;
  updateEditorFontSize(fontSize: number): void;

  indentSpace: IndentSpace;
  updateIndentSpace(indentSpace: IndentSpace): void;

  /**
   * 적절하지 않은 slice에 존재하는 상태들
   */
  isSetting: boolean;
  setIsSetting: (isSetting: boolean) => void;
};

export const createEditorSlice: StateCreator<EditorSlice> = (set, get): EditorSlice => ({
  editorValue: {},
  setEditorValue(fn) {
    set((s) => ({ editorValue: fn(s.editorValue) }));
  },

  fontSize: 14,
  updateEditorFontSize(fontSize) {
    set(() => ({ fontSize }));
  },

  mode: 'normal',
  updateEditorMode(mode) {
    set(() => ({ mode }));
  },

  indentSpace: 2,

  updateIndentSpace(indentSpace) {
    set(() => ({ indentSpace }));
  },

  isSetting: false,
  setIsSetting(isSetting) {
    set(() => ({ isSetting }));
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
