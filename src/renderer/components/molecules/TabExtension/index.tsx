import { useMemo } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyWebview } from '@/renderer/hooks';

import { MovableTab } from '../MovableTab';

interface TabExtensionProps {
  tab: ExtensionInfo;
  index: number;
}

export function TabExtension({ tab, index }: TabExtensionProps) {
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));

  const { gotoUrl } = useModifyWebview();

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
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tab.logoImgBase64} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {tab.title}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
