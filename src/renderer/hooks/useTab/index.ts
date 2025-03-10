import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';

import { isProblemTab } from '@/renderer/utils/typeGuard';

export function useTab() {
  const [tabs] = useStore(useShallow((s) => [s.problemHistories]));

  const problemTabCount = tabs.reduce((count, tab) => count + (isProblemTab(tab) ? 1 : 0), 0);

  return {
    tabs,
    problemTabCount,
  };
}
