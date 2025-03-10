import { useCallback, useMemo } from 'react';

import { useModifyWebview, useProblem, useWebview } from '@/renderer/hooks';

import { MovableTab } from '../MovableTab';

interface TabBookmarkProps {
  tab: BookmarkInfo;
  index: number;
}

export function TabBookmark({ tab, index }: TabBookmarkProps) {
  const { webviewUrl } = useWebview();
  const { problem } = useProblem();

  const { gotoUrl } = useModifyWebview();

  const isSelect = useMemo(() => !problem && webviewUrl.startsWith(tab.url), [problem, webviewUrl, tab]);

  const handleBookmarkItemClick = useCallback(() => {
    gotoUrl(`${tab.url}${tab.path || ''}`);
  }, [gotoUrl, tab]);

  return (
    <MovableTab tabIndex={index} isSelect={isSelect} onClick={handleBookmarkItemClick}>
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabLeftBorder />
      <MovableTab.MovableTabRightBorder />

      <MovableTab.MovableTabLeftLine />

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tab.logoImgBase64} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {tab.title}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
