import { useEffect, useRef } from 'react';

export function useFocusRecovery() {
  const curFocusRef = useRef<Element | null>(null);
  const lastFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    const handleWindowClick = () => {
      if (curFocusRef.current !== document.activeElement) {
        curFocusRef.current = document.activeElement;
      }
    };

    const handleWindowFocus = () => {
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
    };

    const handleWindowBlur = () => {
      lastFocusRef.current = curFocusRef.current;
    };

    window.addEventListener('click', handleWindowClick);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return function cleanup() {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);
}
