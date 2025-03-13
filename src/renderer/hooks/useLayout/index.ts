import { useRef } from 'react';

import { useStore } from '@/renderer/store';

export function useLayout() {
  const webviewRatio = useRef(useStore.getState().leftRatio).current;
  const editorRatio = useRef(useStore.getState().topRatio).current;
  const paintRatio = useRef(useStore.getState().paintLeftRatio).current;

  const historyModalHeight = useRef(useStore.getState().historyModalHeight).current;

  return {
    webviewRatio,
    editorRatio,
    paintRatio,
    historyModalHeight,
  };
}
