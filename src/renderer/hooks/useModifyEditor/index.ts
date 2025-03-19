import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';

export function useModifyEditor() {
  const [setEditorCode] = useStore(useShallow((s) => [s.setCode]));
  const [setEditorMode] = useStore(useShallow((s) => [s.setMode]));
  const [setEditorFontSize] = useStore(useShallow((s) => [s.setFontSize]));
  const [setEditorIndentSpace] = useStore(useShallow((s) => [s.setIndentSpace]));
  const [setEditorLanguage] = useStore(useShallow((s) => [s.setLang]));
  const [setProblemToStale] = useStore(useShallow((s) => [s.setProblemToStale]));

  const [setAiCode] = useStore(useShallow((s) => [s.setAiCode]));

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

  const getEditorValue = useCallback(
    (problem: Problem = useStore.getState().problem, language: Language = useStore.getState().lang) => {
      const { editorValue } = useStore.getState();

      const key = `${problem?.number}|${language}`;

      return editorValue.get(key);
    },
    [],
  );

  const setEditorValue = useCallback((code: string) => {
    const { problem, lang, editorValue } = useStore.getState();

    const key = `${problem?.number}|${lang}`;

    editorValue.set(key, code);
  }, []);

  const syncEditorCode = useCallback(
    (code: string) => {
      setEditorValue(code);
    },
    [setEditorValue],
  );

  const updateEditorCodeByAI = useCallback(
    (code: string) => {
      setAiCode(code);
      setEditorValue(code);
    },
    [setAiCode, setEditorValue],
  );

  const updateEditorCodeByFileIO = useCallback(
    (code: string) => {
      setEditorCode(code);
      setEditorValue(code);
    },
    [setEditorCode, setEditorValue],
  );

  const saveFile = useCallback(
    async (problem: Problem, editorLanguage: Language, silence = false) => {
      if (!problem) {
        return;
      }

      const response = await window.electron.ipcRenderer.invoke('save-code', {
        data: { number: problem.number, language: editorLanguage, code: getEditorValue(problem, editorLanguage) || '' },
      });

      if (!response || !response.data.isSaved) {
        return;
      }

      if (!silence) {
        fireAlertModal('안내', '저장이 완료되었습니다.');
      }
    },
    [fireAlertModal, getEditorValue],
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
    updateEditorCodeByAI,
    updateEditorCodeByFileIO,

    saveFile,
  };
}
