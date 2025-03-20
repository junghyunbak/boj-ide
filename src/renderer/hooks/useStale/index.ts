import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useStale(problem: Problem, editorLanguage: Language) {
  const [problemToStale] = useStore(useShallow((s) => [s.problemToStale]));

  const isStale = problemToStale.get(`${problem?.number}|${editorLanguage}`);

  return { problemToStale, isStale };
}
