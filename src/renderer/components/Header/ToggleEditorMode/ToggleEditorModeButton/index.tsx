import { css } from '@emotion/css';

interface ToggleEditorModeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelect: boolean;
}

export function ToggleEditorModeButton({ isSelect, children, onClick }: ToggleEditorModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={css`
        border: none;
        background-color: ${isSelect ? 'lightgray' : 'transparent'};
        color: ${isSelect ? 'white' : 'lightgray'};
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        font-weight: 500;

        &:hover {
          background-color: lightgray;
          color: white;
        }
      `}
    >
      {children}
    </button>
  );
}
