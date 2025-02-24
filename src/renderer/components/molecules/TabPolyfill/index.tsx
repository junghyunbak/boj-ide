import { useTab } from '@/renderer/hooks';

import { MovableTab } from '../MovableTab';

export function TabPolyfill() {
  const { tabs } = useTab();

  return (
    <MovableTab tabIndex={tabs.length} polyfill>
      <MovableTab.MovableTabBottomBorder />
    </MovableTab>
  );
}
