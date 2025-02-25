import { css } from '@emotion/react';

export function MovableTabRightBorder() {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0px;

        border-left: 1px solid lightgray;
      `}
    />
  );
}
