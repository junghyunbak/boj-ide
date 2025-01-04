import { isParentExist } from '@/renderer/utils';
import { useRef, useEffect } from 'react';

export function useClickOutOfModal(callback: () => void) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      if (isParentExist(e.target, modalRef.current, buttonRef.current)) {
        return;
      }

      callback();
    };

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [callback]);

  return { buttonRef, modalRef };
}
