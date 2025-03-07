import { useRef } from 'react';

import { useWindowEvent } from '../useWindowEvent';

export function useFocusRecovery() {
  const curFocusRef = useRef<Element | null>(null);
  const lastFocusRef = useRef<Element | null>(null);

  useWindowEvent(
    () => {
      if (curFocusRef.current !== document.activeElement) {
        curFocusRef.current = document.activeElement;
      }
    },
    [],
    'click',
  );

  useWindowEvent(
    () => {
      lastFocusRef.current = curFocusRef.current;
    },
    [],
    'blur',
  );

  useWindowEvent(
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
