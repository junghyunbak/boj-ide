import { useRef } from 'react';

import { useEventWindow } from '../useEventWindow';

export function useFocusRecovery() {
  const curFocusRef = useRef<Element | null>(null);
  const lastFocusRef = useRef<Element | null>(null);

  useEventWindow(
    () => {
      if (curFocusRef.current !== document.activeElement) {
        curFocusRef.current = document.activeElement;
      }
    },
    [],
    'click',
  );

  useEventWindow(
    () => {
      lastFocusRef.current = curFocusRef.current;
    },
    [],
    'blur',
  );

  useEventWindow(
    () => {
      setTimeout(() => {
        const $cmContent = document.querySelector('.cm-content');

        if (
          $cmContent instanceof HTMLDivElement &&
          $cmContent === lastFocusRef.current &&
          document.activeElement === document.body
        ) {
          $cmContent.focus();
        }
      }, 50);
    },
    [],
    'focus',
  );
}
