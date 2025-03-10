import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function usePaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));

  return {
    isExpand,
  };
}
