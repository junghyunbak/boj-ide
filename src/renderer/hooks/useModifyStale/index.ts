import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyStale() {
  const [setProblemToStale] = useStore(useShallow((s) => [s.setProblemToStale]));

  const updateProblemToStale = useCallback(
    (problem: Problem, editorLanguage: Language, isStale: boolean) => {
      const key = `${problem?.number}|${editorLanguage}`;

      setProblemToStale(key, isStale);
    },
    [setProblemToStale],
  );

  return {
    updateProblemToStale,
  };
}
