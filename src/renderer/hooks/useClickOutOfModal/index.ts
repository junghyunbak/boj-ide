import { useRef } from 'react';

import { isParentExist } from '@/renderer/utils';

import { useEventWindow } from '../useEventWindow';

export function useClickOutOfModal(callback: () => void) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEventWindow(
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
