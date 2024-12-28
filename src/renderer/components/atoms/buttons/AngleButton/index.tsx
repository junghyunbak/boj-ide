import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import { color } from '@/styles';

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
      <FontAwesomeIcon
        icon={faAngleRight}
        css={css`
          width: 1.125rem;
        `}
      />
    </button>
  );
}
