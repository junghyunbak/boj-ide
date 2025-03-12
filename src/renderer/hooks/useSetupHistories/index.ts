import { useEffect, useRef } from 'react';
import { useHistories } from '../useHistories';

export function useSetupHistories() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isHistoryModalOpen } = useHistories();

  useEffect(() => {
    if (isHistoryModalOpen) {
      inputRef.current?.focus();
    }
  }, [isHistoryModalOpen]);

  return {
    buttonRef,
    modalRef,
    inputRef,
  };
}
