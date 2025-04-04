import { useStore } from '@/renderer/store';
import { CSSProperties, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyToast() {
  const [setToastContext] = useStore(useShallow((s) => [s.setToastContext]));

  const fireToast = useCallback(
    (message: string, bottom: CSSProperties['bottom'] = '20dvh') => {
      setToastContext({
        message,
        bottom,
      });
    },
    [setToastContext],
  );

  const closeToast = useCallback(() => {
    setToastContext(null);
  }, [setToastContext]);

  return {
    fireToast,
    closeToast,
  };
}
