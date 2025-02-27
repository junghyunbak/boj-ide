import { css } from '@emotion/react';
import { ReactComponent as Paint } from '@/renderer/assets/svgs/palette.svg';

interface PaintButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PaintButton({ onClick }: PaintButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={(theme) => css`
        display: flex;
        justify-content: center;
        align-items: center;

        background: none;

        border: none;

        padding: 0.5rem;

        color: ${theme.colors.fg};

        cursor: pointer;
      `}
    >
      <Paint width="1rem" />
    </button>
  );
}
