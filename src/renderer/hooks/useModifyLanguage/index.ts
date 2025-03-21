import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyLanguage() {
  const [setLanguage] = useStore(useShallow((s) => [s.setLang]));

  const updateLanguage = useCallback(
    (language: Language) => {
      setLanguage(language);
    },
    [setLanguage],
  );

  return {
    updateLanguage,
  };
}
