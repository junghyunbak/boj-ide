import { useCallback, useMemo } from 'react';

import { useModifyWebview, useWebview } from '@/renderer/hooks';

import { MovableTab } from '../MovableTab';

interface TabExtensionProps {
  tab: ExtensionInfo;
  index: number;
}

export function TabExtension({ tab, index }: TabExtensionProps) {
  const { webviewUrl } = useWebview();

  const { gotoUrl } = useModifyWebview();

  const url = useMemo(() => `chrome-extension://${tab.id}${tab.path}`, [tab]);
  const isSelect = useMemo(() => webviewUrl === url, [webviewUrl, url]);

  const handleExtensionItemClick = useCallback(() => {
    gotoUrl(url);
  }, [gotoUrl, url]);

  return (
    <MovableTab tabIndex={index} isSelect={isSelect} onClick={handleExtensionItemClick}>
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
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
