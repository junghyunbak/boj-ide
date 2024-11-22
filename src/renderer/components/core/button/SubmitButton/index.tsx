import { css } from '@emotion/css';
import { color } from '../../../../../styles';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SubmitButton({ onClick, children, disabled }: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={css`
        border: none;
        color: white;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        background-color: ${color.primaryBg};
        white-space: nowrap;

        &:disabled {
          background-color: gray;
          cursor: auto;
          color: lightgray;

          &:hover {
            background-color: gray;
          }
        }

        &:hover {
          background-color: #2980b9;
        }
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
