import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useTheme() {
  const [theme] = useStore(useShallow((s) => [s.theme]));

  return {
    theme,
  };
}
