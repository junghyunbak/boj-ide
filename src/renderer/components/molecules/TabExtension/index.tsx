import { useMemo } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useWebviewController } from '@/renderer/hooks';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';

import { MovableTab } from '../MovableTab';

interface TabExtensionProps {
  tab: ExtensionInfo;
  index: number;
}

export function TabExtension({ tab, index }: TabExtensionProps) {
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { gotoUrl } = useWebviewController();

  const url = useMemo(() => `chrome-extension://${tab.id}${tab.path}`, [tab]);
  const isSelect = useMemo(() => webviewUrl === url, [webviewUrl, url]);

  const handleExtensionItemClick = () => {
    gotoUrl(url);
  };

  return (
    <MovableTab tabIndex={index} isSelect={isSelect} onClick={handleExtensionItemClick}>
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
