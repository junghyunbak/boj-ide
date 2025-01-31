import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useEditorCodeSave(silence = false) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));

  const saveEditorCode = useCallback(() => {
    if (!problem) {
      return;
    }

    const code = useStore.getState().problemToCode.get(problem.number) || '';

    window.electron.ipcRenderer.sendMessage('save-code', {
      data: { number: problem.number, language: lang, code, silence },
    });
  }, [problem, lang, silence]);

  return {
    saveEditorCode,
  };
}
