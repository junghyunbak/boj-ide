import { css } from '@emotion/react';
import { ReactComponent as LeftArrow } from '@/renderer/assets/svgs/left-arrow.svg';

interface ArrowButtonProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  disabled?: boolean;
  onClick: () => void;
}

export function ArrowButton({ direction = 'left', disabled = false, onClick }: ArrowButtonProps) {
  const deg = (() => {
    switch (direction) {
      case 'right':
        return 180;
      case 'up':
        return 90;
      case 'down':
        return 270;
      case 'left':
      default:
        return 0;
    }
  })();

  return (
    <button
      type="button"
      css={css`
        display: flex;
        background: none;
        border: none;
        padding: 0.5rem;
        transform: rotate(${deg}deg);
        border-radius: 9999px;
        color: gray;
        cursor: pointer;
        &:disabled {
          color: lightgray;
          cursor: not-allowed;
        }
        &:not(:disabled):hover {
          background-color: #ececec;
        }
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <LeftArrow
        css={css`
          width: 1.125rem;
        `}
      />
    </button>
  );
}