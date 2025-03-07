/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useWindowEvent<T extends keyof WindowEventMap>(
  func: (this: Window, ev: WindowEventMap[T]) => any,
  deps: unknown[],
  type: T,
) {
  useEffect(() => {
    window.addEventListener(type, func);

    return function cleanup() {
      window.removeEventListener(type, func);
    };
  }, [...deps]);
}
