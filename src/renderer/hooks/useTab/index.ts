import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

export function useTab() {
  const [tabs, setTabs] = useStore(useShallow((s) => [s.problemHistories, s.setProblemHistories]));

  const addTab = (problemInfo: ProblemInfo) => {
    setTabs((prev) => {
      const next = [...prev];

      const idx = next.findIndex((v) => v.number === problemInfo.number);

      if (idx !== -1) {
        next.splice(idx, 1, problemInfo);
        return next;
      }

      next.push(problemInfo);
      return next;
    });
  };

  const removeTab = (i: number): ProblemInfo | null => {
    setTabs((prev) => {
      const next = [...prev];

      next.splice(i, 1);

      return next;
    });

    const { problemHistories: nextTabs } = useStore.getState();

    if (nextTabs.length === 0) {
      return null;
    }

    return nextTabs[i] || nextTabs[i - 1];
  };

  const reorderTab = (srcIndex: number, destIndex: number) => {
    setTabs((prev) => {
      const tmp = [...prev] as (ProblemInfo | null)[];

      const [moveElement] = tmp.splice(srcIndex, 1, null);

      if (!moveElement) {
        return prev;
      }

      tmp.splice(destIndex, 0, moveElement);

      const next: ProblemInfo[] = tmp.reduce<ProblemInfo[]>((acc, cur) => {
        if (cur !== null) {
          acc.push(cur);
        }

        return acc;
      }, []);

      return next;
    });
  };

  return {
    tabs,
    addTab,
    removeTab,
    reorderTab,
  };
}
