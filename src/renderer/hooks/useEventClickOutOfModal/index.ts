import { isParentExist } from '@/renderer/utils';

import { useEventWindow } from '../useEventWindow';

export function useEventClickOutOfModal(
  buttonRef: React.RefObject<HTMLButtonElement>,
  modalRef: React.RefObject<HTMLDivElement>,
  callback: () => void = () => {},
) {
  useEventWindow(
    (e) => {
      if (isParentExist(e.target, modalRef.current, buttonRef.current)) {
        return;
      }

      callback();
    },
    [buttonRef, callback, modalRef],
    'click',
  );
}
