import { useMemo } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/react';

import { useProblem, useWebviewController } from '@/renderer/hooks';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import { MovableTab } from '../MovableTab';

interface TabBookmarkProps {
  tab: BookmarkInfo;
  index: number;
}

export function TabBookmark({ tab, index }: TabBookmarkProps) {
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { problem } = useProblem();
  const { gotoUrl } = useWebviewController();

  const isSelect = useMemo(() => !problem && webviewUrl.startsWith(tab.url), [problem, webviewUrl, tab]);

  const handleBookmarkItemClick = () => {
    gotoUrl(`${tab.url}${tab.path || ''}`);
  };

  return (
    <MovableTab tabIndex={index} isSelect={isSelect} onClick={handleBookmarkItemClick}>
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabLeftBorder />
      <MovableTab.MovableTabRightBorder />

      <MovableTab.MovableTabLeftLine />

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {tab.logoImgBase64 && (
            <div
              css={css`
                display: flex;
                width: 0.75rem;
                flex-shrink: 0;
              `}
            >
              <img
                src={tab.logoImgBase64}
                css={css`
                  width: 100%;
                  height: 100%;
                  user-select: none;
                `}
                draggable={false}
              />
            </div>
          )}

          <p
            css={css`
              white-space: nowrap;
              user-select: none;
            `}
          >
            {tab.title}
          </p>
        </MovableTab.MovableTabContent.MovableTabContentDetail>
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
