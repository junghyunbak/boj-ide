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

  const [setAiCode] = useStore(useShallow((s) => [s.setAiCode]));

  const [updateEditorState] = useStore(useShallow((s) => [s.updateEditorState]));
  const [updateEditorView] = useStore(useShallow((s) => [s.updateEditorView]));

  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));

  const { fireAlertModal } = useModifyAlertModal();

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

  const stalingEditorCode = useCallback(() => {
    setIsCodeStale(true);
  }, [setIsCodeStale]);

  const freshingEditorCode = useCallback(() => {
    setIsCodeStale(false);
  }, [setIsCodeStale]);

  const getEditorValue = useCallback(
    (problem: Problem = useStore.getState().problem, language: Language = useStore.getState().lang) => {
      const { editorValue } = useStore.getState();

      const key = `${problem?.number}|${language}`;

      return editorValue.get(key) || '';
    },
    [],
  );

  const setEditorValue = useCallback((code: string) => {
    const { problem, lang, editorValue } = useStore.getState();

    const key = `${problem?.number}|${lang}`;

    editorValue.set(key, code);
  }, []);

  // 에디터 편집으로 인한 코드 동기화에 사용
  const syncEditorCode = useCallback(
    (code: string) => {
      setEditorValue(code);

      stalingEditorCode();
    },
    [setEditorValue, stalingEditorCode],
  );

  // 'AI 표준 입력 생성' 기능 사용으로 인한 코드 초기화에 사용
  const updateAiCode = useCallback(
    (code: string) => {
      setAiCode(code);
      setEditorValue(code);

      stalingEditorCode();
    },
    [setEditorCode, setEditorValue, stalingEditorCode],
  );

  // 문제, 언어 변경으로 인한 코드 초기화에 사용
  const initialEditorCode = useCallback(
    (code: string) => {
      setEditorCode(code);
      setEditorValue(code);

      freshingEditorCode();
    },
    [setEditorCode, setEditorValue, freshingEditorCode],
  );

  const saveFile = useCallback(
    async (
      data: {
        problem?: Problem;
        language?: Language;
        silence?: boolean;
      } = {},
    ) => {
      const { problem = useStore.getState().problem, language = useStore.getState().lang, silence = false } = data;

      const { isCodeStale } = useStore.getState();

      if (!problem || !isCodeStale) {
        return;
      }

      const code = getEditorValue(problem, language);

      const res = await window.electron.ipcRenderer.invoke('save-code', {
        data: { number: problem.number, language, code },
      });

      if (!res || !res.data.isSaved) {
        return;
      }

      freshingEditorCode();

      if (!silence) {
        fireAlertModal('안내', '저장이 완료되었습니다.');
      }
    },
    [fireAlertModal, freshingEditorCode, getEditorValue],
  );

  return {
    updateEditorFontSize,
    updateEditorIndentSpace,
    updateEditorLanguage,
    updateEditorMode,
    updateEditorState,
    updateEditorView,

    stalingEditorCode,
    freshingEditorCode,

    getEditorValue,
    setEditorValue,

    syncEditorCode,
    updateAiCode,
    initialEditorCode,

    saveFile,
  };
}
