import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useSubmitList() {
  const [setSubmitListIsOpen] = useStore(useShallow((s) => [s.setSubmitListIsOpen]));

  const openSubmitList = () => {
    setSubmitListIsOpen(true);
  };

  const closeSumbitList = () => {
    setSubmitListIsOpen(false);
  };

  return {
    openSubmitList,
    closeSumbitList,
  };
}
