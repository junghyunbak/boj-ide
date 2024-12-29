import { color } from '@/styles';
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
        return '0.125rem 0.25rem';
      case 'normal':
      default:
        return '0.4rem 0.8rem';
    }
  })();

  return (
    <button
      type="button"
      css={css`
        background: none;
        border: none;
        padding: ${padding};
        cursor: pointer;
        color: ${color.text};
        font-size: ${fontSize};
        &:hover {
          color: ${color.primaryText};
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
