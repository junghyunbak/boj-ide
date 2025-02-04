import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useAlertModalState() {
  const [alertTitle] = useStore(useShallow((s) => [s.alertTitle]));
  const [alertContent] = useStore(useShallow((s) => [s.alertContent]));

  const isAlertModalOpen = alertTitle !== null && alertContent !== null;

  return {
    alertTitle,
    alertContent,
    isAlertModalOpen,
  };
}
