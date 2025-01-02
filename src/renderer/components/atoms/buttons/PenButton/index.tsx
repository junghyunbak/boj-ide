import { css } from '@emotion/react';
import { ReactComponent as Pen } from '@/renderer/assets/svgs/pen.svg';

interface PenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PenButton({ onClick }: PenButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        background: none;
        border: none;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: gray;
        cursor: pointer;
      `}
    >
      <Pen width="1rem" />
    </button>
  );
}
