import { css } from '@emotion/react';

export function StaleBall() {
  return (
    <div
      data-testid="stale-ball"
      css={(theme) => css`
        width: 8px;
        aspect-ratio: 1/1;
        border-radius: 9999px;
        background-color: ${theme.colors.fg};
      `}
    />
  );
}
