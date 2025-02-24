import { useCallback } from 'react';

import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

import { isBookmarkTab, isExtensionTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { WEBVIEW_HOME_URL } from '@/renderer/constants';

import { useWebviewController } from '../useWebviewController';

export function useTab() {
  const [tabs, setTabs] = useStore(useShallow((s) => [s.problemHistories, s.setProblemHistories]));
  const { gotoProblem, gotoUrl } = useWebviewController();

  const addProblemTab = useCallback(
    (problemTab: ProblemInfo) => {
      setTabs((prev) => {
        const problemTabs = prev.filter(isProblemTab);

        if (problemTabs.find((tab) => tab.number === problemTab.number)) {
          return prev.map((tab) => (isProblemTab(tab) ? (tab.number === problemTab.number ? problemTab : tab) : tab));
        }

        return [...prev, problemTab];
      });
    },
    [setTabs],
  );

  const addBookmarkTab = useCallback(
    (bookmarkTab: BookmarkInfo) => {
      setTabs((prev) => {
        const bookmarkTabs = prev.filter(isBookmarkTab);

        if (bookmarkTabs.find((tab) => tab.url === bookmarkTab.url)) {
          return prev.map((tab) => (isBookmarkTab(tab) ? (tab.url === bookmarkTab.url ? bookmarkTab : tab) : tab));
        }

        return [bookmarkTab, ...prev];
      });
    },
    [setTabs],
  );

  const addExtensionTab = useCallback(
    (extensionTab: ExtensionInfo) => {
      setTabs((prev) => {
        const extensionTabs = prev.filter(isExtensionTab);

        if (extensionTabs.find((tab) => tab.type === extensionTab.type)) {
          return prev.map((tab) => (isExtensionTab(tab) ? (tab.type === extensionTab.type ? extensionTab : tab) : tab));
        }

        return [extensionTab, ...prev];
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
      } else if (isBookmarkTab(nextTab)) {
        gotoUrl(`${nextTab.url}${nextTab.path || ''}`);
      } else {
        gotoUrl(`chrome-extension://${nextTab.id}${nextTab.path}`);
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

    setTabs((prev) => prev.filter((tab) => !isProblemTab(tab)));

    if (currentTabs.filter(isProblemTab).length > 0) {
      gotoUrl(WEBVIEW_HOME_URL);
    }
  }, [gotoUrl, setTabs]);

  return {
    tabs,
    addProblemTab,
    addBookmarkTab,
    addExtensionTab,
    removeTab,
    reorderTab,
    clearTab,
  };
}
