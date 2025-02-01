import { useCallback } from 'react';

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

export function useAlertModalController() {
  const [setAlertTitle] = useStore(useShallow((s) => [s.setAlertTitle]));
  const [setAlertContent] = useStore(useShallow((s) => [s.setAlertContent]));

  const fireAlertModal = useCallback(
    (title: string, content: string) => {
      setAlertTitle(title);
      setAlertContent(content);
    },
    [setAlertTitle, setAlertContent],
  );

  const closeAlertModal = useCallback(() => {
    setAlertTitle(null);
    setAlertContent(null);
  }, [setAlertTitle, setAlertContent]);

  return {
    fireAlertModal,
    closeAlertModal,
  };
}
