import { useRef } from 'react';

import { isParentExist } from '@/renderer/utils';

import { useWindowEvent } from '../useWindowEvent';

export function useClickOutOfModal(callback: () => void) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useWindowEvent(
    (e) => {
      if (isParentExist(e.target, modalRef.current, buttonRef.current)) {
        return;
      }

      callback();
    },
    [callback],
    'click',
  );

  return { buttonRef, modalRef };
}
