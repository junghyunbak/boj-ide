import { createContext, useContext } from 'react';

import { StoreApi, UseBoundStore } from 'zustand';

export type SplitLayoutStoreState = {
  leftRef: React.MutableRefObject<HTMLDivElement | null>;
  resizerRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;

  vertical: boolean;

  isDrag: boolean;
  startX: number;
  leftWidth: number;
};

export const LayoutContext = createContext<{
  splitLayoutStore: UseBoundStore<StoreApi<SplitLayoutStoreState>> | null;
}>({ splitLayoutStore: null });

export function useSplitLayoutStoreContext() {
  const { splitLayoutStore } = useContext(LayoutContext);

  if (!splitLayoutStore) {
    throw new Error('[LayoutStore] store를 초기화한 후 사용해야 합니다.');
  }

  return { splitLayoutStore };
}
