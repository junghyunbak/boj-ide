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
      css={(theme) => css`
        width: 100%;
        text-align: start;
        background: none;
        border: none;
        padding: 0.3rem 0.9rem;
        color: ${theme.colors.fg};
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          background-color: ${theme.colors.active};
        }
      `}
    >
      {children}
    </button>
  );
}
