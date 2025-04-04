import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useIdb() {
  const [problemToFabricJSON] = useFabricStore(useShallow((s) => [s.problemToFabricJSON]));

  return {
    problemToFabricJSON,
  };
}
