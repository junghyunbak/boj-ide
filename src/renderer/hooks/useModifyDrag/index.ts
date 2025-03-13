import { useStore } from '@/renderer/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyDrag() {
  const [setIsResizerDrag] = useStore(useShallow((s) => [s.setIsResizerDrag]));
  const [setIsTabDrag] = useStore(useShallow((s) => [s.setIsTabDrag]));
  const [setDestTabIndex] = useStore(useShallow((s) => [s.setDestTabIndex]));

  const updateIsResizerDrag = useCallback(
    (isDrag: boolean) => {
      setIsResizerDrag(isDrag);
    },
    [setIsResizerDrag],
  );

  const updateIsTabDrag = useCallback(
    (isDrag: boolean) => {
      setIsTabDrag(isDrag);
    },
    [setIsTabDrag],
  );

  const updateDestTabIndex = useCallback(
    (tabIndex: number) => {
      setDestTabIndex(tabIndex);
    },
    [setDestTabIndex],
  );

  return {
    updateIsResizerDrag,
    updateIsTabDrag,
    updateDestTabIndex,
  };
}
