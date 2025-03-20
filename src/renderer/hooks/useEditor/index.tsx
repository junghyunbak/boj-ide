import { useStore } from '@/renderer/store';
import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';

export function useEditor() {
  const [editorState] = useStore(useShallow((s) => [s.editorState]));
  const [editorView] = useStore(useShallow((s) => [s.editorView]));

  const [editorLanguage] = useStore(useShallow((s) => [s.lang]));

  const [editorMode] = useStore(useShallow((s) => [s.mode]));
  const [editorIndentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [editorFontSize] = useStore(useShallow((s) => [s.fontSize]));

  const [editorRef] = useStore(useShallow((s) => [s.editorRef]));

  const EDITOR_FONT_SIZES = useRef<number[]>([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).current;
  const EDITOR_MODES = useRef<EditorMode[]>(['normal', 'vim']).current;
  const EDITOR_INDENT_SPACES = useRef<IndentSpace[]>([2, 4]).current;

  return {
    editorFontSize,
    editorIndentSpace,
    editorLanguage,
    editorMode,
    editorRef,
    editorState,
    editorView,
    EDITOR_FONT_SIZES,
    EDITOR_MODES,
    EDITOR_INDENT_SPACES,
  };
}
