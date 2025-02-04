import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

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
