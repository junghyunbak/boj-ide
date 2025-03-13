import { useRef } from 'react';

import { useStore } from '@/renderer/store';

export function useLayout() {
  const webviewRatio = useRef(useStore.getState().leftRatio).current;
  const editorRatio = useRef(useStore.getState().topRatio).current;

  return {
    webviewRatio,
    editorRatio,
  };
}
