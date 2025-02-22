import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { zIndex } from '@/renderer/styles';

interface MovableTabLineProps {
  tabIndex: number;
  dir: 'left' | 'right';
}

export function MovableTabLine({ tabIndex, dir }: MovableTabLineProps) {
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destTabIndex] = useStore(useShallow((s) => [s.destTabIndex]));

  const isHidden = !isTabDrag || destTabIndex !== tabIndex;

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;

        ${dir === 'left'
          ? css`
              left: 0;
            `
          : css`
              right: 0;
            `}
      `}
    >
      <div
        css={css`
          position: absolute;
          top: 0;
          bottom: 0;

          ${isHidden
            ? css``
            : css`
                background-color: gray;
              `}

          ${dir === 'left'
            ? css`
                left: -1px;
              `
            : css`
                left: -1px;
              `}

          width: 3px;

          z-index: ${zIndex.tab.indexLine};
        `}
      />
    </div>
  );
}
