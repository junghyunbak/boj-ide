import { useStore } from '@/renderer/store';
import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

export function useSubmitList() {
  const [setSubmitListIsOpen] = useStore(useShallow((s) => [s.setSubmitListIsOpen]));

  const openSubmitList = () => {
    setSubmitListIsOpen(true);
  };

  const closeSumbitList = () => {
    setSubmitListIsOpen(false);
  };

  return {
    openSubmitList,
    closeSumbitList,
  };
}

export function useClickOutOfModal(callback: () => void) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      const modal = modalRef.current;
      const button = buttonRef.current;

      if (!modal || !button) {
        return;
      }

      const isContain = (() => {
        let $el = e.target;

        while ($el instanceof HTMLElement) {
          if ($el === modal || $el === button) {
            return true;
          }

          $el = $el.parentElement;
        }

        return false;
      })();

      if (!isContain) {
        callback();
      }
    };

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [callback]);

  return { buttonRef, modalRef };
}
