import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyConfirmModal() {
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
