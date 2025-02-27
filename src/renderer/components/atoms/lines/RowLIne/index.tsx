import { css } from '@emotion/react';

export function RowLine() {
  return (
    <div
      css={(theme) => css`
        border-bottom: 1px solid ${theme.colors.border};
      `}
    />
  );
}
