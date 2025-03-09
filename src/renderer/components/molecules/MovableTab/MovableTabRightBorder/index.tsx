import { css } from '@emotion/react';

import { useMovableTabContext } from '../MovableTabContext';

export function MovableTabRightBorder() {
  const { ghost } = useMovableTabContext();

  return (
    <div
      css={(theme) => css`
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0px;

        ${ghost
          ? css`
              border-left: 1px dashed ${theme.colors.accent};
            `
          : css`
              border-left: 1px solid ${theme.colors.border};
            `}
      `}
    />
  );
}
