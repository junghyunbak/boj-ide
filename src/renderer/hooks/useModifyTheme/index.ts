import { useCallback } from 'react';

import { type Themes } from '@/renderer/store/slices/theme';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyTheme() {
  const [setTheme] = useStore(useShallow((s) => [s.setTheme]));

  const updateTheme = useCallback(
    (newTheme: Themes) => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  return {
    updateTheme,
  };
}
