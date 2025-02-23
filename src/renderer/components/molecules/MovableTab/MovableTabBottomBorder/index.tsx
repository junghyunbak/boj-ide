import { css } from '@emotion/react';

import { useMovableTabContext } from '../MovableTabContext';

export function MovableTabBottomBorder() {
  const { isSelect } = useMovableTabContext();

  if (isSelect) {
    return null;
  }

  return (
    <div
      css={css`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        border-top: 1px solid lightgray;
      `}
    />
  );
}
