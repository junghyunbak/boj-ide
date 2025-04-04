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
  const [isPaintExpand] = useStore(useShallow((s) => [s.isPaintExpand]));

  return {
    isPaintOpen,
    isPaintExpand,

    webviewRatio,
    editorRatio,
    paintRatio,
    historyModalHeight,
  };
}
