import { useStore } from '@/renderer/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyDrag() {
  const [setIsResizerDrag] = useStore(useShallow((s) => [s.setIsResizerDrag]));

  const updateIsResizerDrag = useCallback(
    (isDrag: boolean) => {
      setIsResizerDrag(isDrag);
    },
    [setIsResizerDrag],
  );

  return {
    updateIsResizerDrag,
  };
}
