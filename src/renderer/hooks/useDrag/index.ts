import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useDrag() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destTabIndex] = useStore(useShallow((s) => [s.destTabIndex]));

  return {
    isResizerDrag,
    isTabDrag,
    destTabIndex,
  };
}
