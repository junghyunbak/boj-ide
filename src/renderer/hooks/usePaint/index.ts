import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function usePaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));
  const [paintRef] = useFabricStore(useShallow((s) => [s.paintRef]));

  return {
    isExpand,
    paintRef,
  };
}
