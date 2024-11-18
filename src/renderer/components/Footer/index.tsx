import { css } from '@emotion/css';
import { color } from '../../../styles';

export function Footer() {
  return (
    <div
      className={css`
        width: 100%;
        height: 30px;
        border-top: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
      `}
    >
      <div
        className={css`
          button {
            border: none;
            background-color: transparent;
            font-size: 0.75rem;
            color: ${color.text};
            cursor: pointer;

            &:hover {
              color: #428bca;
              background-color: rgba(0, 0, 0, 0.1);
            }
          }
        `}
      >
        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('open-source-code-folder');
          }}
        >
          코드 저장소
        </button>

        <button
          type="button"
          onClick={() => {
            window.open('https://boj-ide.gitbook.io/boj-ide-docs', '_blank');
          }}
        >
          메뉴얼
        </button>
      </div>

      <p
        className={css`
          margin: 0;
          font-size: 0.75rem;
          color: ${color.text};
        `}
      >
        v1.1.3
      </p>
    </div>
  );
}
