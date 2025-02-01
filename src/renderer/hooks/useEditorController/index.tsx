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

  const getProblemCode = useCallback(() => {
    if (!problem) {
      return '';
    }

    return useStore.getState().problemToCode.get(problem.number) || '';
  }, [problem]);

  const setProblemCode = useCallback(
    (code: string) => {
      if (problem) {
        setProblemToCode(problem.number, code);
      }
    },
    [problem, setProblemToCode],
  );

  const stalingEditorCode = useCallback(() => {
    setIsCodeStale(true);
  }, [setIsCodeStale]);

  const freshingEditorCode = useCallback(() => {
    setIsCodeStale(false);
  }, [setIsCodeStale]);

  const updateEditorCode = useCallback(
    (code: string) => {
      setProblemCode(code);
      stalingEditorCode();
    },
    [setProblemCode, stalingEditorCode],
  );

  const initialEditorCode = useCallback(
    (code: string) => {
      setEditorCode(code);
      setProblemCode(code);
      stalingEditorCode();
    },
    [setEditorCode, setProblemCode, stalingEditorCode],
  );

  const saveEditorCode = useCallback(async () => {
    if (!problem) {
      return;
    }

    const { isCodeStale } = useStore.getState();

    if (!isCodeStale) {
      return;
    }

    const code = getProblemCode();

    const res = await window.electron.ipcRenderer.invoke('save-code', {
      data: { number: problem.number, language: lang, code },
    });

    if (!silence && res && res.data.isSaved) {
      fireAlertModal('안내', '저장이 완료되었습니다.');
      freshingEditorCode();
    }
  }, [problem, getProblemCode, lang, silence, fireAlertModal, freshingEditorCode]);

  return {
    getProblemCode,
    saveEditorCode,
    stalingEditorCode,
    freshingEditorCode,
    updateEditorCode,
    initialEditorCode,
  };
}
