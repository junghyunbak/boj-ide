import { css } from '@emotion/react';

import { useMovableTabContext } from '../MovableTabContext';

export function MovableTabLeftBorder() {
  const { ghost } = useMovableTabContext();

  return (
    <div
      css={(theme) => css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

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
