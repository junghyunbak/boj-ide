import { css } from '@emotion/react';

export function MovableTabRightBorder() {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        // BUG: 정수 픽셀로 계산되면서 갭 발생
        right: -1px;

        border-left: 1px solid lightgray;
      `}
    />
  );
}
