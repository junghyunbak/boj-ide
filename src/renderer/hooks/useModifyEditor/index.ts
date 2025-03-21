import { useCallback } from 'react';

import { EditorState } from '@codemirror/state';

import { languageToExt } from '@/renderer/utils';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';

export function useModifyEditor() {
  const [updateEditorState] = useStore(useShallow((s) => [s.updateEditorState]));
  const [updateEditorView] = useStore(useShallow((s) => [s.updateEditorView]));
  const [updateEditorMode] = useStore(useShallow((s) => [s.updateEditorMode]));
  const [updateEditorFontSize] = useStore(useShallow((s) => [s.updateEditorFontSize]));
  const [updateEditorIndentSpace] = useStore(useShallow((s) => [s.updateIndentSpace]));

  const [setEditorValue] = useStore(useShallow((s) => [s.setEditorValue]));

  const { fireAlertModal } = useModifyAlertModal();

  const removeEditorValue = useCallback(
    (problem: Problem, language: Language) => {
      if (!problem) {
        return;
      }

      setEditorValue((prevState) => {
        const nextEditorValue = { ...prevState };

        const languageToValue = nextEditorValue[problem.number];

        if (!languageToValue) {
          return nextEditorValue;
        }

        const value = languageToValue[language];

        if (!value) {
          return nextEditorValue;
        }

        delete languageToValue[language];

        return nextEditorValue;
      });
    },
    [setEditorValue],
  );

  const updateEditorValue = useCallback(
    (problem: Problem, language: Language, cur: string | null) => {
      if (!problem) {
        return;
      }

      setEditorValue((prevState) => {
        const languageToValue = prevState[problem.number] || {};

        const value = languageToValue[language] || { prev: null, cur: null };

        value.cur = cur;

        return {
          ...prevState,
          [problem.number]: {
            ...languageToValue,
            [language]: value,
          },
        };
      });
    },
    [setEditorValue],
  );

  const getEditorValue = useCallback((problem: Problem, language: Language) => {
    if (!problem) {
      return null;
    }

    const { editorValue } = useStore.getState();

    const languageToValue = editorValue[problem.number];

    if (!languageToValue) {
      return null;
    }

    const value = languageToValue[language];

    if (!value) {
      return null;
    }

    return value.cur;
  }, []);

  const syncEditorValue = useCallback(
    (problem: Problem, language: Language) => {
      if (!problem) {
        return;
      }

      setEditorValue((prevState) => {
        const languageToValue = prevState[problem.number] || {};

        const cur = getEditorValue(problem, language);

        return {
          ...prevState,
          [problem.number]: {
            ...languageToValue,
            [language]: {
              prev: cur,
              cur,
            },
          },
        };
      });
    },
    [setEditorValue, getEditorValue],
  );

  const createEditorState = useCallback((initialCode: string) => {
    const newEditorState = EditorState.create({
      doc: initialCode,
    });

    return newEditorState;
  }, []);

  const saveCode = useCallback(
    async (problem: Problem, language: Language) => {
      if (!problem) {
        return;
      }

      const code = getEditorValue(problem, language);

      if (!code) {
        return;
      }

      const result = await window.electron.ipcRenderer.invoke('save-code', {
        data: {
          number: problem.number,
          language,
          code,
        },
      });

      if (result && result.data.isSaved) {
        syncEditorValue(problem, language);
      }
    },
    [getEditorValue, syncEditorValue],
  );

  const saveDefaultCode = useCallback(
    async (problem: Problem, language: Language) => {
      if (!problem) {
        return;
      }

      const code = getEditorValue(problem, language);

      if (!code) {
        return;
      }

      const result = await window.electron.ipcRenderer.invoke('save-default-code', {
        data: { language, code },
      });

      if (result && result.data.isSaved) {
        fireAlertModal('안내', `default.${languageToExt(language)} 파일이 성공적으로 업데이트 되었습니다.`);
      }
    },
    [fireAlertModal, getEditorValue],
  );

  return {
    updateEditorState,
    updateEditorView,

    updateEditorFontSize,
    updateEditorIndentSpace,
    updateEditorMode,

    removeEditorValue,
    updateEditorValue,
    syncEditorValue,
    getEditorValue,

    saveCode,
    saveDefaultCode,

    createEditorState,
  };
}
