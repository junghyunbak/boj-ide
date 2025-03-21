import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useStale(problem: Problem, language: Language) {
  const [editorValue] = useStore(useShallow((s) => [s.editorValue]));

  const isStale = (() => {
    if (!problem) {
      return false;
    }

    const languageToValue = editorValue[problem.number];

    if (!languageToValue) {
      return false;
    }

    const value = languageToValue[language];

    if (!value) {
      return false;
    }

    return value.cur !== value.prev;
  })();

  return { isStale };
}
