import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyEditor() {
  const [updateEditorState] = useStore(useShallow((s) => [s.updateEditorState]));
  const [updateEditorView] = useStore(useShallow((s) => [s.updateEditorView]));

  const [setEditorLanguage] = useStore(useShallow((s) => [s.setLang]));

  const [setEditorMode] = useStore(useShallow((s) => [s.setMode]));
  const [setEditorFontSize] = useStore(useShallow((s) => [s.setFontSize]));
  const [setEditorIndentSpace] = useStore(useShallow((s) => [s.setIndentSpace]));

  const updateEditorLanguage = useCallback(
    (language: Language) => {
      setEditorLanguage(language);
    },
    [setEditorLanguage],
  );

  const updateEditorMode = useCallback(
    (mode: EditorMode) => {
      setEditorMode(mode);
    },
    [setEditorMode],
  );

  const updateEditorFontSize = useCallback(
    (fontSize: number) => {
      setEditorFontSize(fontSize);
    },
    [setEditorFontSize],
  );

  const updateEditorIndentSpace = useCallback(
    (indentSpace: IndentSpace) => {
      setEditorIndentSpace(indentSpace);
    },
    [setEditorIndentSpace],
  );

  const getEditorValue = useCallback((problem: Problem, editorLanguage: Language) => {
    const key = `${problem?.number}|${editorLanguage}`;

    return useStore.getState().editorValue.get(key);
  }, []);

  const setEditorValue = useCallback((problem: Problem, editorLanguage: Language, code: string | null) => {
    const key = `${problem?.number}|${editorLanguage}`;

    useStore.getState().editorValue.set(key, code);
  }, []);

  const saveCode = useCallback(
    async (problem: Problem, editorLanguage: Language) => {
      if (!problem) {
        return;
      }

      await window.electron.ipcRenderer.invoke('save-code', {
        data: { number: problem.number, language: editorLanguage, code: getEditorValue(problem, editorLanguage) || '' },
      });
    },
    [getEditorValue],
  );

  return {
    updateEditorState,
    updateEditorView,

    updateEditorLanguage,

    updateEditorFontSize,
    updateEditorIndentSpace,
    updateEditorMode,

    getEditorValue,
    setEditorValue,

    saveCode,
  };
}
