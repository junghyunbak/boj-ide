import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useProblem() {
  const [problem] = useStore(useShallow((s) => [s.problem, s.setProblem]));

  return {
    problem,
  };
}
