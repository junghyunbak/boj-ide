import { useRef } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useLayout() {
  const webviewRatio = useRef(useStore.getState().leftRatio).current;
  const editorRatio = useRef(useStore.getState().topRatio).current;
  const paintRatio = useRef(useStore.getState().paintLeftRatio).current;

  const historyModalHeight = useRef(useStore.getState().historyModalHeight).current;

  const [isPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen]));

  return {
    isPaintOpen,
    webviewRatio,
    editorRatio,
    paintRatio,
    historyModalHeight,
  };
}
