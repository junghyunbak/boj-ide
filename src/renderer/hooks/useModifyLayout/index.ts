import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyLayout() {
  const [setLeftRatio] = useStore(useShallow((s) => [s.setLeftRatio]));
  const [setTopRatio] = useStore(useShallow((s) => [s.setTopRatio]));

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

  return { updateWebviewRatio, updateEditorRatio };
}
