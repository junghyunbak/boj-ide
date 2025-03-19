import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';

export function useModifyEditor() {
  const [setEditorMode] = useStore(useShallow((s) => [s.setMode]));
  const [setEditorFontSize] = useStore(useShallow((s) => [s.setFontSize]));
  const [setEditorIndentSpace] = useStore(useShallow((s) => [s.setIndentSpace]));
  const [setEditorLanguage] = useStore(useShallow((s) => [s.setLang]));
  const [setProblemToStale] = useStore(useShallow((s) => [s.setProblemToStale]));

  const [updateEditorState] = useStore(useShallow((s) => [s.updateEditorState]));
  const [updateEditorView] = useStore(useShallow((s) => [s.updateEditorView]));

  const { fireAlertModal } = useModifyAlertModal();

  const updateProblemToStale = useCallback(
    (problem: Problem, editorLanguage: Language, isStale: boolean) => {
      const key = `${problem?.number}|${editorLanguage}`;

      setProblemToStale(key, isStale);
    },
    [setProblemToStale],
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

  const updateEditorLanguage = useCallback(
    (language: Language) => {
      setEditorLanguage(language);
    },
    [setEditorLanguage],
  );

  const getEditorValue = useCallback((problem: Problem, editorLanguage: Language) => {
    const key = `${problem?.number}|${editorLanguage}`;

    return useStore.getState().editorValue.get(key);
  }, []);

  const setEditorValue = useCallback((problem: Problem, editorLanguage: Language, code: string | null) => {
    const key = `${problem?.number}|${editorLanguage}`;

    useStore.getState().editorValue.set(key, code);
  }, []);

  const syncEditorCode = useCallback(
    (problem: Problem, editorLanguage: Language, code: string) => {
      setEditorValue(problem, editorLanguage, code);
    },
    [setEditorValue],
  );

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
    updateProblemToStale,
    updateEditorFontSize,
    updateEditorIndentSpace,
    updateEditorLanguage,
    updateEditorMode,
    updateEditorState,
    updateEditorView,

    getEditorValue,
    setEditorValue,

    syncEditorCode,

    saveCode,
  };
}
