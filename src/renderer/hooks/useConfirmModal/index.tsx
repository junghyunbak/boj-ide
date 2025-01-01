import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useConfirmModal() {
  const [confirmMessage, callback, setConfirm] = useStore(
    useShallow((s) => [s.confirmMessage, s.callback, s.setConfirm]),
  );

  const fireConfirmModal = (message: string, func: () => void) => {
    setConfirm(message, func);
  };

  const approveConfirmModal = () => {
    if (callback instanceof Function) {
      callback();
      setConfirm('', null);
    }
  };

  const cancelConfirmModal = () => {
    setConfirm('', null);
  };

  const isConfirmModalOpen = callback instanceof Function;

  return {
    isConfirmModalOpen,
    confirmMessage,
    fireConfirmModal,
    approveConfirmModal,
    cancelConfirmModal,
  };
}
