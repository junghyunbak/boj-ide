import { css } from '@emotion/react';
import { color } from '@/styles';
import { HTMLAttributes } from 'react';
import Color from 'color';

interface ActionButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ variant = 'primary', children, onClick, disabled = false }: ActionButtonProps) {
  const bgColor = (() => {
    switch (variant) {
      case 'secondary':
        return color.secondaryBg;
      case 'primary':
      default:
        return color.primaryBg;
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'secondary':
      case 'primary':
      default:
        return 'white';
    }
  })();

  return (
    <button
      type="button"
      css={css`
        border: none;
        padding: 0.4rem 0.8rem;
        background-color: ${bgColor};
        color: ${textColor};
        cursor: pointer;
        &:hover {
          background-color: ${Color(bgColor).lighten(0.05).toString()};
        }
        &:disabled {
          cursor: auto;
          background-color: ${Color(bgColor).darken(0.2).toString()};
          color: lightgray;
          &:hover {
            background-color: ${Color(bgColor).darken(0.25).toString()};
          }
        }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
