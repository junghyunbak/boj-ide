import { css } from '@emotion/react';

interface MovableTabContentIconProps {
  src?: string | null;
}

export function MovableTabContentIcon({ src }: MovableTabContentIconProps) {
  if (!src) {
    return null;
  }

  return (
    <div
      css={css`
        display: flex;
        width: 0.75rem;
        flex-shrink: 0;
      `}
    >
      <img
        src={src}
        css={css`
          width: 100%;
          height: 100%;
          user-select: none;
          pointer-events: none;
        `}
      />
    </div>
  );
}
