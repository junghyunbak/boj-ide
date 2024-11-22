import { css } from '@emotion/css';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';

export function ToggleEditorMode() {
  const [mode, setMode] = useStore(useShallow((s) => [s.mode, s.setMode]));

  return (
    <div
      className={css`
        display: flex;
        border: 1px solid lightgray;
        overflow: hidden;

        button {
          transition: all ease 0.2s;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-weight: 500;

          &:hover {
            background-color: lightgray;
            color: white;
          }

          p {
            margin: 0;
          }
        }
      `}
    >
      <button
        className={css`
          border: none;
          background-color: ${mode === 'normal' ? 'lightgray' : 'transparent'};
          color: ${mode === 'normal' ? 'white' : 'lightgray'};
        `}
        type="button"
        onClick={() => {
          setMode('normal');
        }}
      >
        normal
      </button>

      <button
        className={css`
          border: none;
          background-color: ${mode === 'vim' ? 'lightgray' : 'transparent'};
          color: ${mode === 'vim' ? 'white' : 'lightgray'};
        `}
        type="button"
        onClick={() => {
          setMode('vim');
        }}
      >
        vim
      </button>
    </div>
  );
}
