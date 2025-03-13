import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { WEBVIEW_HOME_URL } from '@/renderer/constants';

import { isProblemTab, isBookmarkTab, isExtensionTab } from '@/renderer/utils/typeGuard';

import { useModifyWebview } from '../useModifyWebview';

export function useModifyTab() {
  const [setTabs] = useStore(useShallow((s) => [s.setProblemHistories]));

  const { gotoUrl, gotoProblem } = useModifyWebview();

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

  const reorderTab = useCallback(
    (srcIndex: number, destIndex: number) => {
      setTabs((prev) => {
        if (srcIndex === destIndex || srcIndex + 1 === destIndex) {
          return prev;
        }

        const next = [...prev];

        const [moveElement] = next.splice(srcIndex, 1);

        if (srcIndex < destIndex) {
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
    const { problemHistories: currentTabs, problem } = useStore.getState();

    setTabs((prev) => prev.filter((tab) => !isProblemTab(tab)));

    if (currentTabs.filter(isProblemTab).length > 0 && problem) {
      gotoUrl(WEBVIEW_HOME_URL);
    }
  }, [gotoUrl, setTabs]);

  return {
    addProblemTab,
    addBookmarkTab,
    addExtensionTab,
    removeTab,
    reorderTab,
    clearTab,
  };
}
