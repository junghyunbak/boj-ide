import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/react';

import { useWebviewController } from '@/renderer/hooks';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import { MovableTab } from '../MovableTab';

interface BookmarkTabProps {
  tab: BookmarkInfo;
  index: number;
}

export function BookmarkTab({ tab, index }: BookmarkTabProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { gotoUrl } = useWebviewController();

  const isSelect = (() => {
    if (problem) {
      return false;
    }

    if (webviewUrl.startsWith(tab.url)) {
      return true;
    }

    return false;
  })();

  const handleBookmarkItemClick = () => {
    gotoUrl(tab.url + (tab.path || ''));
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

          <Text whiteSpace="nowrap" userSelect="none">
            {tab.title}
          </Text>
        </MovableTab.MovableTabContent.MovableTabContentDetail>
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
