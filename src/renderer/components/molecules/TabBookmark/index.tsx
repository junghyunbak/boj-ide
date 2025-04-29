import { useCallback, useMemo } from 'react';

import { useModifyTab, useModifyWebview, useProblem, useWebview } from '@/renderer/hooks';

import normalizeUrl, { type Options } from 'normalize-url';

import { MovableTab } from '../MovableTab';

interface TabBookmarkProps {
  tab: BookmarkInfo;
  index: number;
}

export function TabBookmark({ tab, index }: TabBookmarkProps) {
  const { webviewUrl } = useWebview();
  const { problem } = useProblem();

  const { gotoUrl } = useModifyWebview();
  const { removeTab } = useModifyTab();

  const isSelect = useMemo(() => {
    if (problem) {
      return false;
    }

    const normalizeUrlOptions: Options = {
      stripWWW: false,
      removeQueryParameters: true,
      stripHash: true,
      removeTrailingSlash: true,
    };

    return (
      normalizeUrl(webviewUrl, normalizeUrlOptions) === normalizeUrl(tab.url + (tab.path || ''), normalizeUrlOptions)
    );
  }, [problem, webviewUrl, tab]);

  const handleTabCloseButtonClick = () => {
    removeTab(index, isSelect);
  };

  const handleBookmarkItemClick = useCallback(() => {
    gotoUrl(`${tab.url}${tab.path || ''}`);
  }, [gotoUrl, tab]);

  return (
    <MovableTab tabIndex={index} isSelect={isSelect} onClick={handleBookmarkItemClick}>
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabLeftBorder />
      <MovableTab.MovableTabRightBorder />

      {index === 0 && <MovableTab.MovableTabLeftLine />}

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tab.logoImgBase64} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {tab.title}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
        {tab.custom && (
          <MovableTab.MovableTabContent.MovableTabContentCloseButton onClick={handleTabCloseButtonClick} />
        )}
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
