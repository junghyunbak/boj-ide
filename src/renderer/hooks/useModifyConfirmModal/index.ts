import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyConfirmModal() {
  const [setConfirmMessage] = useStore(useShallow((s) => [s.setConfirmMessage]));
  const [setConfirmCallback] = useStore(useShallow((s) => [s.setConfirmCallback]));
  const [setCancelCallback] = useStore(useShallow((s) => [s.setCancelCallback]));

  const fireConfirmModal = (
    message: string,
    confirmCallback: () => void,
    cancelCallback: (() => void) | null = null,
  ) => {
    setConfirmCallback(confirmCallback);
    setCancelCallback(cancelCallback);
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
