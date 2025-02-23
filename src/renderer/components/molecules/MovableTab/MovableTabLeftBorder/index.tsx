import { css } from '@emotion/react';

export function MovableTabLeftBorder() {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        border-left: 1px solid lightgray;
      `}
    />
  );
}
