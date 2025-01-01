import { css } from '@emotion/react';
import { color } from '@/styles';

import { ReactComponent as AngleRight } from '@/renderer/assets/svgs/angle-right.svg';

interface AngleButtonProps {
  onClick: () => void;
}

export function AngleButton({ onClick }: AngleButtonProps) {
  return (
    <button
      type="button"
      css={css`
        border: none;
        background: none;
        padding: 0.5rem;
        color: ${color.text};
        cursor: pointer;
      `}
      onClick={onClick}
    >
      <AngleRight width="0.5rem" />
    </button>
  );
}
