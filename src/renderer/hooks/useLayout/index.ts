import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useLayout() {
  const {
    historyModalHeight,
    leftRatio: webviewRatio,
    topRatio: editorRatio,
    paintLeftRatio: paintRatio,
  } = useStore.getState();

  const [isPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen]));

  return {
    isPaintOpen,
    webviewRatio,
    editorRatio,
    paintRatio,
    historyModalHeight,
  };
}
