import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useAlertModalController } from '@/renderer/hooks';

export function useEditorController() {
  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));
  const [setEditorCode] = useStore(useShallow((s) => [s.setCode]));
  const [setProblemToCode] = useStore(useShallow((s) => [s.setProblemToCode]));

  const { fireAlertModal } = useAlertModalController();

  const getProblemCode = useCallback(() => {
    const { problem, problemToCode } = useStore.getState();

    if (!problem) {
      return '';
    }

    return problemToCode.get(problem.number) || '';
  }, []);

  const setProblemCode = useCallback(
    (code: string) => {
      const { problem } = useStore.getState();

      if (problem) {
        setProblemToCode(problem.number, code);
      }
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

  return {
    getProblemCode,
    saveEditorCode,
    syncEditorCode,
    stalingEditorCode,
    freshingEditorCode,
    updateEditorCode,
    initialEditorCode,
  };
}
