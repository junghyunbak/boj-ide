import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyLayout() {
  const [setLeftRatio] = useStore(useShallow((s) => [s.setLeftRatio]));
  const [setTopRatio] = useStore(useShallow((s) => [s.setTopRatio]));
  const [setPaintLeftRatio] = useStore(useShallow((s) => [s.setPaintLeftRatio]));
  const [setHistoryModalHeight] = useStore(useShallow((s) => [s.setHistoryModalHeight]));

  const updateWebviewRatio = useCallback(
    (webviewRatio: number) => {
      setLeftRatio(webviewRatio);
    },
    [setLeftRatio],
  );

  const updateEditorRatio = useCallback(
    (editorRatio: number) => {
      setTopRatio(editorRatio);
    },
    [setTopRatio],
  );

  const updatePaintRatio = useCallback(
    (paintRatio: number) => {
      setPaintLeftRatio(paintRatio);
    },
    [setPaintLeftRatio],
  );

  const updateHistoryModalHeight = useCallback(
    (px: number) => {
      setHistoryModalHeight(px);
    },
    [setHistoryModalHeight],
  );

  return { updateWebviewRatio, updateEditorRatio, updatePaintRatio, updateHistoryModalHeight };
}
