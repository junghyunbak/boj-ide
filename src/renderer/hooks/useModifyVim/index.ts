import { useStore } from '@/renderer/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyVim() {
  const [setVimMode] = useStore(useShallow((s) => [s.setVimMode]));

  const updateVimMode = useCallback(
    (vimMode: string) => {
      setVimMode(vimMode);
    },
    [setVimMode],
  );

  return { updateVimMode };
}
