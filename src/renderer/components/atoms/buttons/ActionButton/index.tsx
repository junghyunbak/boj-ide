import { css, useTheme } from '@emotion/react';
import { color } from '@/renderer/styles';
import { HTMLAttributes } from 'react';
import Color from 'color';

interface ActionButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: 'primary' | 'secondary' | 'cancel';
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ variant = 'primary', children, onClick, disabled = false }: ActionButtonProps) {
  const theme = useTheme();

  const bgColor = (() => {
    switch (variant) {
      case 'secondary':
        return color.secondaryBg;
      case 'cancel':
        return '#95a5a6';
      case 'primary':
      default:
        return theme.colors.primarybg;
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
        color: ${theme.colors.buttonFg};
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          background-color: ${Color(bgColor).lighten(0.05).toString()};
        }

        &:disabled {
          cursor: auto;
          background-color: ${Color(bgColor).darken(0.2).toString()};
          color: ${theme.colors.disabledFg};
        }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
