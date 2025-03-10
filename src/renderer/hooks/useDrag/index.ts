import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useDrag() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  return { isResizerDrag };
}
