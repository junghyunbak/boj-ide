import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';

export function useModifyEditor() {
  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));
  const [setEditorCode] = useStore(useShallow((s) => [s.setCode]));
  const [setProblemToCode] = useStore(useShallow((s) => [s.setProblemToCode]));
  const [setEditorWidth] = useStore(useShallow((s) => [s.setEditorWidth]));
  const [setEditorHeight] = useStore(useShallow((s) => [s.setEditorHeight]));
  const [setEditorMode] = useStore(useShallow((s) => [s.setMode]));
  const [setEditorFontSize] = useStore(useShallow((s) => [s.setFontSize]));
  const [setEditorIndentSpace] = useStore(useShallow((s) => [s.setIndentSpace]));
  const [setEditorLanguage] = useStore(useShallow((s) => [s.setLang]));

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

  // TODO: 테스트
  const getProblemCode = useCallback(() => {
    const { problem, problemToCode, lang } = useStore.getState();

    return problemToCode.get(`${problem?.number}|${lang}`) || '';
  }, []);

  // TODO: 테스트
  const setProblemCode = useCallback(
    (code: string) => {
      const { problem, lang } = useStore.getState();

      setProblemToCode(`${problem?.number}|${lang}`, code);
    },
    [setProblemToCode],
  );

  const stalingEditorCode = useCallback(() => {
    setIsCodeStale(true);
  }, [setIsCodeStale]);

  const freshingEditorCode = useCallback(() => {
    setIsCodeStale(false);
  }, [setIsCodeStale]);

  /**
   * - 에디터 입력
   */
  const syncEditorCode = useCallback(
    (code: string) => {
      setProblemCode(code);
      stalingEditorCode();
    },
    [setProblemCode, stalingEditorCode],
  );

  /**
   * - AI 입력 템플릿 생성
   */
  const updateEditorCode = useCallback(
    (code: string) => {
      setEditorCode(code);
      setProblemCode(code);
      stalingEditorCode();
    },
    [setEditorCode, setProblemCode, stalingEditorCode],
  );

  /**
   * - 문제/언어 변경 시 코드 로딩
   */
  const initialEditorCode = useCallback(
    (code: string) => {
      setEditorCode(code);
      setProblemCode(code);
      freshingEditorCode();
    },
    [setEditorCode, setProblemCode, freshingEditorCode],
  );

  /**
   * 코드가 오래되지 않았을 경우에만 저장하는 함수
   */
  const saveEditorCode = useCallback(
    async (opt?: { silence?: boolean }) => {
      const { problem, isCodeStale, lang } = useStore.getState();

      if (!problem || !isCodeStale) {
        return;
      }

      const code = getProblemCode();

      const res = await window.electron.ipcRenderer.invoke('save-code', {
        data: { number: problem.number, language: lang, code },
      });

      if (!res || !res.data.isSaved) {
        return;
      }

      freshingEditorCode();

      if (opt && opt.silence) {
        return;
      }

      fireAlertModal('안내', '저장이 완료되었습니다.');
    },
    [getProblemCode, fireAlertModal, freshingEditorCode],
  );

  const resizeEditorLayout = useCallback(
    (width: number, height: number) => {
      setEditorWidth(width);
      setEditorHeight(height);
    },
    [setEditorHeight, setEditorWidth],
  );

  return {
    getProblemCode,
    saveEditorCode,
    syncEditorCode,

    stalingEditorCode,
    freshingEditorCode,

    updateEditorFontSize,
    updateEditorIndentSpace,
    updateEditorLanguage,
    updateEditorCode,
    updateEditorMode,

    initialEditorCode,

    resizeEditorLayout,
  };
}
