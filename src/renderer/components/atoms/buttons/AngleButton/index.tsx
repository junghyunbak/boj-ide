import { css } from '@emotion/react';

import { ReactComponent as AngleRight } from '@/renderer/assets/svgs/angle-right.svg';

interface AngleButtonProps {
  onClick: () => void;
}

export function AngleButton({ onClick }: AngleButtonProps) {
  return (
    <button
      type="button"
      css={(theme) => css`
        border: none;
        background: none;
        padding: 0.5rem;
        color: ${theme.colors.fg};
        cursor: pointer;
      `}
      onClick={onClick}
    >
      <AngleRight width="0.5rem" />
    </button>
  );
}
