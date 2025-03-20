import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useStale() {
  const [problemToStale] = useStore(useShallow((s) => [s.problemToStale]));

  return { problemToStale };
}
