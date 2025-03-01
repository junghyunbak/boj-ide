import { css } from '@emotion/react';
import { forwardRef } from 'react';

interface SelectButtonProps {
  isActive: boolean;
  children: string;
  onClick: () => void;
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(({ isActive, children, onClick }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      css={(theme) => css`
        background-color: ${theme.colors.bg};
        border: 1px solid ${theme.colors.border};
        color: ${theme.colors.fg};
        padding: 0.4rem 0.8rem;
        white-space: nowrap;

        ${isActive
          ? css`
              box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
            `
          : css``}

        outline: none;
        cursor: pointer;

        &::after {
          content: '';
          display: inline-block;
          margin-left: 0.255em;
          vertical-align: 0.255em;
          border-top: 0.3em solid;
          border-right: 0.3em solid transparent;
          border-left: 0.3em solid transparent;
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
