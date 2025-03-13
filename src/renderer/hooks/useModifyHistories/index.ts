import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { HISTORY_MAX_LENGTH } from '@/renderer/constants';

export function useModifyHistories() {
  const [setHistories] = useStore(useShallow((s) => [s.setHistories]));
  const [setIsHistoryModalOpen] = useStore(useShallow((s) => [s.setIsHistoryModalOpen]));
  const [setHistoryFilterValue] = useStore(useShallow((s) => [s.setHistoryFilterValue]));

  const addHistory = useCallback(
    (problemInfo: ProblemInfo) => {
      setHistories((prev) => {
        return [problemInfo, ...prev.filter((problem) => problem.number !== problemInfo.number)].slice(
          0,
          HISTORY_MAX_LENGTH,
        );
      });
    },
    [setHistories],
  );

  const removeHistory = useCallback(
    (idx: number) => {
      setHistories((prev) => {
        return prev.filter((problem, i) => i !== idx);
      });
    },
    [setHistories],
  );

  const removeHistoryWithProblemNumber = useCallback(
    (willRemoveProblem: ProblemInfo) => {
      setHistories((prev) => {
        return prev.filter((problem) => problem.number !== willRemoveProblem.number);
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

  const updateHistoryFilterValue = useCallback(
    (value: string) => {
      setHistoryFilterValue(value);
    },
    [setHistoryFilterValue],
  );

  return {
    addHistory,
    removeHistory,
    removeHistoryWithProblemNumber,
    openHistoryModal,
    closeHistoryModal,
    updateHistoryFilterValue,
  };
}
