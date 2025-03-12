import { useEffect } from 'react';
import { useHistories } from '../useHistories';

export function useSetupHistories() {
  const { historyModalInputRef } = useHistories();

  const { isHistoryModalOpen } = useHistories();

  useEffect(() => {
    if (isHistoryModalOpen) {
      historyModalInputRef.current?.focus();
    }
  }, [historyModalInputRef, isHistoryModalOpen]);
}
