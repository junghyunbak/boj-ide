import { color } from '@/styles';
import { css } from '@emotion/react';

interface ListButtonProps {
  children: string;
  onClick: () => void;
}

export function ListButton({ onClick, children }: ListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        width: 100%;
        text-align: start;
        background: none;
        border: none;
        padding: 0.3rem 0.9rem;
        color: ${color.text};
        cursor: pointer;
        &:hover {
          background-color: #f5f5f5;
        }
      `}
    >
      {children}
    </button>
  );
}
