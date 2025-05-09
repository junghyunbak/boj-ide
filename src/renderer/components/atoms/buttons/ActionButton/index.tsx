import { forwardRef } from 'react';

import { css, useTheme } from '@emotion/react';

import Color from 'color';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cancel' | 'interupt';
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({ variant, ...props }, ref) => {
  const theme = useTheme();

  const bgColor = (() => {
    switch (variant) {
      case 'interupt':
        return '#d9534f';
      case 'cancel':
        return '#95a5a6';
      case 'primary':
      default:
        return theme.colors.primarybg;
    }
  })();

  return (
    <button
      type="button"
      ref={ref}
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
      {...props}
    />
  );
});
