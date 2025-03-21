import { useCallback } from 'react';

import { languageToExt } from '@/renderer/utils';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyStale } from '../useModifyStale';
import { useModifyAlertModal } from '../useModifyAlertModal';

export function useModifyEditor() {
  const [updateEditorState] = useStore(useShallow((s) => [s.updateEditorState]));
  const [updateEditorView] = useStore(useShallow((s) => [s.updateEditorView]));

  const [setEditorLanguage] = useStore(useShallow((s) => [s.setLang]));

  const [setEditorMode] = useStore(useShallow((s) => [s.setMode]));
  const [setEditorFontSize] = useStore(useShallow((s) => [s.setFontSize]));
  const [setEditorIndentSpace] = useStore(useShallow((s) => [s.setIndentSpace]));

  const { updateProblemToStale } = useModifyStale();
  const { fireAlertModal } = useModifyAlertModal();

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

      const result = await window.electron.ipcRenderer.invoke('save-code', {
        data: { number: problem.number, language: editorLanguage, code: getEditorValue(problem, editorLanguage) || '' },
      });

      if (result && result.data.isSaved) {
        updateProblemToStale(problem, editorLanguage, false);
      }
    },
    [getEditorValue, updateProblemToStale],
  );

  const saveDefaultCode = useCallback(
    async (problem: Problem, editorLanguage: Language) => {
      if (!problem) {
        return;
      }

      const result = await window.electron.ipcRenderer.invoke('save-default-code', {
        data: { language: editorLanguage, code: getEditorValue(problem, editorLanguage) || '' },
      });

      if (result && result.data.isSaved) {
        fireAlertModal('안내', `default.${languageToExt(editorLanguage)} 파일이 성공적으로 업데이트 되었습니다.`);
      }
    },
    [fireAlertModal, getEditorValue],
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
    saveDefaultCode,
  };
}
