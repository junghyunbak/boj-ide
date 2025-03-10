import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useHistories() {
  const [histories] = useStore(useShallow((s) => [s.histories]));
  const [isHistoryModalOpen] = useStore(useShallow((s) => [s.isHistoryModalOpen]));

  const isHistoryEmpty = histories.length === 0;

  return {
    histories,
    isHistoryEmpty,
    isHistoryModalOpen,
  };
}
