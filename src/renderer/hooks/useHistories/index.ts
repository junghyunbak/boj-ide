import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useHistories() {
  const [histories] = useStore(useShallow((s) => [s.histories]));
  const [isHistoryModalOpen] = useStore(useShallow((s) => [s.isHistoryModalOpen]));
  const [historyFilterValue] = useStore(useShallow((s) => [s.historyFilterValue]));

  const isHistoryEmpty = histories.length === 0;

  return {
    histories,
    historyFilterValue,
    isHistoryEmpty,
    isHistoryModalOpen,
  };
}
