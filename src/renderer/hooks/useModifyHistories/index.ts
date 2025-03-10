import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyHistories() {
  const [setHistories] = useStore(useShallow((s) => [s.setHistories]));
  const [setIsHistoryModalOpen] = useStore(useShallow((s) => [s.setIsHistoryModalOpen]));

  const addHistory = useCallback(
    (problemInfo: ProblemInfo) => {
      setHistories((prev) => {
        return [problemInfo, ...prev.filter((problem) => problem.number !== problemInfo.number)];
      });
    },
    [setHistories],
  );

  const popHistory = useCallback(() => {
    const { histories } = useStore.getState();

    const next = [...histories];

    const ret = next.pop();

    setHistories(next);

    return ret;
  }, [setHistories]);

  const removeHistory = useCallback(
    (idx: number) => {
      setHistories((prev) => {
        return prev.filter((problem, i) => i !== idx);
      });
    },
    [setHistories],
  );

  const openHistoryModal = useCallback(() => {
    setIsHistoryModalOpen(true);
  }, [setIsHistoryModalOpen]);

  const closeHistoryModal = useCallback(() => {
    setIsHistoryModalOpen(false);
  }, [setIsHistoryModalOpen]);

  const updateHistoryModalHeight = useCallback((height: number) => {
    useStore.getState().historyModalHeight = height;
  }, []);

  return {
    addHistory,
    popHistory,
    removeHistory,
    openHistoryModal,
    closeHistoryModal,
    updateHistoryModalHeight,
  };
}
