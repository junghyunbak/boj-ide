import { css } from '@emotion/css';
import { color } from '@/styles';
import Color from 'color';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

export function SubmitButton({ onClick, children, disabled, secondary = false }: SubmitButtonProps) {
  const bgColor = secondary ? color.secondaryBg : color.primaryBg;

  return (
    <button
      type="button"
      onClick={onClick}
      className={css`
        border: none;
        color: white;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        background-color: ${bgColor};
        white-space: nowrap;

        &:disabled {
          background-color: ${Color(bgColor).darken(0.2).toString()};
          cursor: auto;
          color: lightgray;

          &:hover {
            background-color: ${Color(bgColor).darken(0.25).toString()};
          }
        }

        &:hover {
          background-color: ${Color(bgColor).lighten(0.05).toString()};
        }
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
