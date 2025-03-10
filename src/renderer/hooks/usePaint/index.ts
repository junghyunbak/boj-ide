import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyFabric } from '../useModifyFabric';
import { useResponsiveLayout } from '../useResponsiveLayout';

export function usePaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));

  const { updateFabricCanvasSize } = useModifyFabric();

  const { containerRef } = useResponsiveLayout(updateFabricCanvasSize);

  return {
    isExpand,
    containerRef,
  };
}
