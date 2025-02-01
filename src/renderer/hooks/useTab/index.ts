import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

// TODO: useCallback 적용
export function useTab() {
  const [tabs, setTabs] = useStore(useShallow((s) => [s.problemHistories, s.setProblemHistories]));

  const addTab = (problemInfo: ProblemInfo) => {
    setTabs((prev) => {
      return prev.some((tab) => tab.number === problemInfo.number)
        ? prev.map((tab) => (tab.number === problemInfo.number ? problemInfo : tab))
        : [...prev, problemInfo];
    });
  };

  const removeTab = (i: number): ProblemInfo | null => {
    setTabs((prev) => {
      return prev.filter((_, idx) => idx !== i);
    });

    const { problemHistories: nextTabs } = useStore.getState();

    if (nextTabs.length === 0) {
      return null;
    }

    return nextTabs[i] || nextTabs[i - 1];
  };

  const reorderTab = (srcIndex: number, destIndex: number) => {
    setTabs((prev) => {
      if (srcIndex === destIndex) {
        return prev;
      }

      const next = [...prev];

      const [moveElement] = next.splice(srcIndex, 1);

      if (destIndex > srcIndex) {
        next.splice(destIndex - 1, 0, moveElement);
      } else {
        next.splice(destIndex, 0, moveElement);
      }

      return next;
    });
  };

  const clearTab = useCallback(() => {
    setTabs(() => []);
  }, [setTabs]);

  return {
    tabs,
    addTab,
    removeTab,
    reorderTab,
    clearTab,
  };
}
