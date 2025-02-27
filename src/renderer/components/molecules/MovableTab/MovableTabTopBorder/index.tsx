import { css } from '@emotion/react';

import { useMovableTabContext } from '../MovableTabContext';

export function MovableTabTopBorder() {
  const { isSelect } = useMovableTabContext();

  return (
    <div
      css={(theme) => css`
        ${isSelect
          ? css`
              border-top: 1px solid ${theme.colors.primarybg};
            `
          : css`
              border-top: 1px solid ${theme.colors.border};
            `}
      `}
    />
  );
}
