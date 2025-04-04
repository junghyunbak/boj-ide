import { useRef, useEffect } from 'react';

import { useModifyToast } from '../useModifyToast';
import { useToast } from '../useToast';

export function useEventToast() {
  const { toastContext } = useToast();

  const { closeToast } = useModifyToast();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toastContext) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      closeToast();
    }, toastContext.time);
  }, [toastContext, closeToast]);
}
