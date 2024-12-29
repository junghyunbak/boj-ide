import { color } from '@/styles';
import { css } from '@emotion/react';

interface TextButtonProps {
  children: string;
  onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

export function TextButton({ children, onClick }: TextButtonProps) {
  return (
    <button
      type="button"
      css={css`
        border: none;
        background: none;
        color: ${color.primaryText};
        padding: 0;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
