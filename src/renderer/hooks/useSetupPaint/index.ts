import { useEffect } from 'react';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useSetupPaint(containerRef: React.RefObject<HTMLDivElement>) {
  const [setPaintRef] = useFabricStore(useShallow((s) => [s.setPaintRef]));

  useEffect(() => {
    setPaintRef(containerRef);
  }, [containerRef, setPaintRef]);
}
