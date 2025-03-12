import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useHistories() {
  const [histories] = useStore(useShallow((s) => [s.histories]));
  const [isHistoryModalOpen] = useStore(useShallow((s) => [s.isHistoryModalOpen]));
  const [historyFilterValue] = useStore(useShallow((s) => [s.historyFilterValue]));
  const [historyButtonRef] = useStore(useShallow((s) => [s.historyButtonRef]));
  const [historyModalRef] = useStore(useShallow((s) => [s.historyModalRef]));
  const [historyModalInputRef] = useStore(useShallow((s) => [s.historyModalInputRef]));

  const isHistoryEmpty = histories.length === 0;

  return {
    histories,
    historyFilterValue,
    isHistoryEmpty,
    isHistoryModalOpen,
    historyButtonRef,
    historyModalRef,
    historyModalInputRef,
  };
}
