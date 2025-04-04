import { useStore } from '@/renderer/store';
import { CSSProperties, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyToast() {
  const [setToastContext] = useStore(useShallow((s) => [s.setToastContext]));

  const fireToast = useCallback(
    ({
      message,
      bottom = '20dvh',
      time = 1500,
    }: {
      message: string;
      bottom?: CSSProperties['bottom'];
      time?: number;
    }) => {
      setToastContext({
        message,
        bottom,
        time,
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
