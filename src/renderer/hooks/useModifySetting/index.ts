import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifySetting() {
  const [setIsSetting] = useStore(useShallow((s) => [s.setIsSetting]));

  const updateIsSetting = useCallback(
    (isSetting: boolean) => {
      setIsSetting(isSetting);
    },
    [setIsSetting],
  );

  return {
    updateIsSetting,
  };
}
