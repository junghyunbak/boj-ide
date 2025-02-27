import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { type Themes } from '@/renderer/store/slices/theme';

export function useTheme() {
  const [theme, setTheme] = useStore(useShallow((s) => [s.theme, s.setTheme]));

  const updateTheme = useCallback(
    (newTheme: Themes) => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  return {
    theme,
    updateTheme,
  };
}
