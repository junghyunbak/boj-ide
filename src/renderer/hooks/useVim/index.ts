import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useVim() {
  const [vimMode] = useStore(useShallow((s) => [s.vimMode]));

  return { vimMode };
}
