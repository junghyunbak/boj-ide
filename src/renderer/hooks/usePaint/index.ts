import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useFabricCanvasController } from '../useFabricCanvasController';
import { usePaintEvent } from '../usePaintEvent';
import { useResponsiveLayout } from '../useResponsiveLayout';

export function usePaint() {
  const [setPaintRef] = useFabricStore(useShallow((s) => [s.setPaintRef]));

  const { containerRef } = useResponsiveLayout(useFabricCanvasController().updateFabricCanvasSize);

  usePaintEvent();

  /**
   * paintRef 동기화
   */
  useEffect(() => {
    setPaintRef(containerRef);
  }, [containerRef, setPaintRef]);

  return {
    containerRef,
  };
}
