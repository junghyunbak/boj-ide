import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useEditor() {
  const [editorIndentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [editorCode] = useStore(useShallow((s) => [s.code]));
  const [editorMode] = useStore(useShallow((s) => [s.mode]));
  const [editorFontSize] = useStore(useShallow((s) => [s.fontSize]));
  const [editorLanguage] = useStore(useShallow((s) => [s.lang]));
  const [editorRef] = useStore(useShallow((s) => [s.editorRef]));
  const [editorState] = useStore(useShallow((s) => [s.editorState]));
  const [editorView] = useStore(useShallow((s) => [s.editorView]));
  const [isCodeStale] = useStore(useShallow((s) => [s.isCodeStale]));
  const [setEditorState] = useStore(useShallow((s) => [s.setEditorState]));

  return {
    editorCode,
    editorFontSize,
    editorIndentSpace,
    editorLanguage,
    editorMode,
    editorRef,
    editorState,
    editorView,
    setEditorState,
    isCodeStale,
  };
}
