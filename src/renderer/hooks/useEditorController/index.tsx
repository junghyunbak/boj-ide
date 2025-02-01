import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useAlertModalController } from '@/renderer/hooks';

export function useEditorController(silence = false) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));
  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));
  const [setEditorCode] = useStore(useShallow((s) => [s.setCode]));
  const [setProblemToCode] = useStore(useShallow((s) => [s.setProblemToCode]));

  const { fireAlertModal } = useAlertModalController();

  const stalingEditorCode = useCallback(() => {
    setIsCodeStale(true);
  }, [setIsCodeStale]);

  const freshingEditorCode = useCallback(() => {
    setIsCodeStale(false);
  }, [setIsCodeStale]);

  const updateEditorCode = useCallback(
    (code: string) => {
      if (problem) {
        setProblemToCode(problem.number, code);
        stalingEditorCode();
      }
    },
    [problem, setProblemToCode, stalingEditorCode],
  );

  const initialEditorCode = useCallback(
    (code: string) => {
      if (problem) {
        setEditorCode(code);
        setProblemToCode(problem.number, code);
        stalingEditorCode();
      }
    },
    [setEditorCode, setProblemToCode, stalingEditorCode, problem],
  );

  const saveEditorCode = useCallback(() => {
    if (!problem) {
      return;
    }

    const { problemToCode, isCodeStale } = useStore.getState();

    if (!isCodeStale) {
      return;
    }

    const code = problemToCode.get(problem.number) || '';

    // TODO: invoke로 변경한 후 결과에 따라 메세지 출력
    window.electron.ipcRenderer.sendMessage('save-code', {
      data: { number: problem.number, language: lang, code },
    });

    if (!silence) {
      fireAlertModal('안내', '저장이 완료되었습니다.');
      freshingEditorCode();
    }
  }, [problem, lang, silence, fireAlertModal, freshingEditorCode]);

  return {
    saveEditorCode,
    stalingEditorCode,
    freshingEditorCode,
    updateEditorCode,
    initialEditorCode,
  };
}
