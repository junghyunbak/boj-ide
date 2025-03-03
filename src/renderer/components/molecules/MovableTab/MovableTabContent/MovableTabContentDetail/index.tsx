import { css } from '@emotion/react';

interface MovableTabContentDetailProps {
  children?: string;
}

export function MovableTabContentDetail({ children }: MovableTabContentDetailProps) {
  return (
    <p
      css={css`
        white-space: nowrap;
        user-select: none;
      `}
    >
      {children}
    </p>
  );
}
