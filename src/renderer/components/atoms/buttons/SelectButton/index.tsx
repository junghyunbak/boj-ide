import { color } from '@/renderer/styles';
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
      css={css`
        border: 1px solid #ccc;
        color: ${color.text};
        padding: 0.4rem 0.8rem;
        font-weight: 500;
        white-space: nowrap;
        box-shadow: ${isActive ? 'inset 0 3px 5px rgba(0, 0, 0, 0.125)' : 'none'};
        background: ${isActive ? '#e6e6e6' : 'none'};
        outline: none;
        cursor: pointer;
        &:hover {
          background: #e6e6e6;
          border-color: #adadad;
        }
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
