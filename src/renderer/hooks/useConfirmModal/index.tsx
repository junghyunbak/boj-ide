import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useConfirmModalState() {
  const [confirmMessage] = useStore(useShallow((s) => [s.confirmMessage]));
  const [confirmCallback] = useStore(useShallow((s) => [s.confirmCallback]));

  const isConfirmModalOpen = confirmCallback instanceof Function;

  return {
    confirmMessage,
    confirmCallback,
    isConfirmModalOpen,
  };
}

export function useConfirmModalController() {
  const [setConfirmMessage] = useStore(useShallow((s) => [s.setConfirmMessage]));
  const [setConfirmCallback] = useStore(useShallow((s) => [s.setConfirmCallback]));

  const fireConfirmModal = (message: string, cb: () => void) => {
    setConfirmCallback(cb);
    setConfirmMessage(message);
  };

  const cancelConfirmModal = () => {
    setConfirmCallback(null);
    setConfirmMessage(null);
  };

  return {
    fireConfirmModal,
    cancelConfirmModal,
  };
}
