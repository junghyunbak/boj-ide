/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useEventElement<E extends keyof HTMLElementEventMap>(
  cb: (ev: HTMLElementEventMap[E]) => void,
  deps: unknown[],
  eventName: E,
  el: HTMLElement | undefined | null,
) {
  useEffect(() => {
    if (!el) {
      return function cleanup() {};
    }

    el.addEventListener(eventName, cb);

    return function cleanup() {
      el.removeEventListener(eventName, cb);
    };
  }, [...deps, el]);
}
