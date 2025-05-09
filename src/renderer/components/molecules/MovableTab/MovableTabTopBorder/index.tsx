import { css } from '@emotion/react';

import { useMovableTabContext } from '../MovableTabContext';

export function MovableTabTopBorder() {
  const { isSelect, ghost } = useMovableTabContext();

  return (
    <div
      css={css`
        position: absolute;
        left: 0;
        right: 0;
      `}
    >
      <div
        css={(theme) => css`
          width: 100%;

          ${ghost
            ? css`
                border-top: 1px dashed ${theme.colors.accent};
              `
            : css`
                border-top: 1px solid ${theme.colors.border};
              `}
        `}
      />
      {isSelect && (
        <div
          css={(theme) => css`
            width: 100%;
            border-top: 1px solid ${theme.colors.primaryfg};
          `}
        />
      )}
    </div>
  );
}
