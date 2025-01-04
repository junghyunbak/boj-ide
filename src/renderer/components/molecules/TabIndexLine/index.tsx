import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

interface TabIndexLineProps {
  tabIndex: number;
}

export function TabIndexLine({ tabIndex }: TabIndexLineProps) {
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destTabIndex] = useStore(useShallow((s) => [s.destTabIndex]));

  const isHidden = !isTabDrag || destTabIndex !== tabIndex;
  const borderWidth = `${tabIndex === 0 ? 2 : 1}px`;

  return (
    <div
      css={css`
        border-color: ${isHidden ? 'transparent' : 'gray'};
        border-style: solid;
        border-width: 0;
        border-left-width: ${borderWidth};
      `}
    />
  );
}
