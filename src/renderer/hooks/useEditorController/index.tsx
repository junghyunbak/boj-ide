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

  const saveEditorCode = useCallback(async () => {
    if (!problem) {
      return;
    }

    const { problemToCode, isCodeStale } = useStore.getState();

    if (!isCodeStale) {
      return;
    }

    const code = problemToCode.get(problem.number) || '';

    const res = await window.electron.ipcRenderer.invoke('save-code', {
      data: { number: problem.number, language: lang, code },
    });

    if (!silence && res && res.data.isSaved) {
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
