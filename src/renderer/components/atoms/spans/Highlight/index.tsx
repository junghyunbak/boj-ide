import { css } from '@emotion/react';

interface HighlightProps {
  children: string;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span
      css={css`
        color: #e74c3c;
      `}
    >
      {children}
    </span>
  );
}
