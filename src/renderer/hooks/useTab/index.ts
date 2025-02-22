import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { BOJ_DOMAIN } from '@/common/constants';

import { useWebviewController } from '../useWebviewController';

export function useTab() {
  const [tabs, setTabs] = useStore(useShallow((s) => [s.problemHistories, s.setProblemHistories]));
  const { gotoProblem, gotoUrl } = useWebviewController();

  const addTab = useCallback(
    (newTab: Tab) => {
      setTabs((prev) => {
        const problemTabs = prev.filter(isProblemTab);
        const bookmarkTabs = prev.filter(isBookmarkTab);

        if (isProblemTab(newTab)) {
          if (!problemTabs.some((tab) => tab.number === newTab.number)) {
            return [...prev, newTab];
          }

          return prev.map((tab) => {
            if (isBookmarkTab(tab)) {
              return tab;
            }

            return tab.number === newTab.number ? newTab : tab;
          });
        }

        if (!bookmarkTabs.some((tab) => tab.url === newTab.url)) {
          return [newTab, ...prev];
        }

        return prev.map((tab) => {
          if (isProblemTab(tab)) {
            return tab;
          }

          return tab.url === newTab.url ? newTab : tab;
        });
      });
    },
    [setTabs],
  );

  // TODO: 테스트 코드 작성
  const removeTab = useCallback(
    (i: number, isSelect: boolean) => {
      setTabs((prev) => {
        return prev.filter((_, idx) => idx !== i);
      });

      if (!isSelect) {
        return;
      }

      const { problemHistories: nextTabs } = useStore.getState();

      if (nextTabs.length === 0) {
        return;
      }

      const nextTab = nextTabs[i] || nextTabs[i - 1];

      if (isProblemTab(nextTab)) {
        gotoProblem(nextTab);
      } else {
        gotoUrl(nextTab.url + (nextTab.path || ''));
      }
    },
    [gotoProblem, gotoUrl, setTabs],
  );

  // TODO: 테스트 코드 작성
  const reorderTab = useCallback(
    (srcIndex: number, destIndex: number) => {
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
    },
    [setTabs],
  );

  const clearTab = useCallback(() => {
    const { problemHistories: currentTabs } = useStore.getState();

    setTabs((prev) => prev.filter(isBookmarkTab));

    if (currentTabs.filter(isProblemTab).length > 0) {
      gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
    }
  }, [gotoUrl, setTabs]);

  return {
    tabs,
    addTab,
    removeTab,
    reorderTab,
    clearTab,
  };
}
