import { css } from '@emotion/react';

interface TransparentButtonProps {
  children: string;
  onClick: () => void;
  size?: 'normal' | 'small';
}

export function TransparentButton({ children, onClick, size = 'normal' }: TransparentButtonProps) {
  const fontSize = (() => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'normal':
      default:
        return '1rem';
    }
  })();

  const padding = (() => {
    switch (size) {
      case 'small':
        return '0.2rem 0.4rem';
      case 'normal':
      default:
        return '0.4rem 0.8rem';
    }
  })();

  return (
    <button
      type="button"
      css={(theme) => css`
        background: none;
        border: none;
        padding: ${padding};
        color: ${theme.colors.fg};
        font-size: ${fontSize};
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          color: ${theme.colors.primaryfg};
          background-color: ${theme.colors.active};
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
