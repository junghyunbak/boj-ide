import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useConfirmModal() {
  const [confirmMessage] = useStore(useShallow((s) => [s.confirmMessage]));
  const [confirmCallback] = useStore(useShallow((s) => [s.confirmCallback]));
  const [cancelCallback] = useStore(useShallow((s) => [s.cancelCallback]));

  const isConfirmModalOpen = confirmCallback instanceof Function;

  return {
    confirmMessage,
    confirmCallback,
    cancelCallback,
    isConfirmModalOpen,
  };
}
