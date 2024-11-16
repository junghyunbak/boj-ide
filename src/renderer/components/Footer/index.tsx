import { css } from '@emotion/css';

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
            border-radius: 4px;
            cursor: pointer;
            transition: all ease 0.2s;

            &:hover {
              background-color: rgba(0, 0, 0, 0.2);
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
        `}
      >
        v1.1.2
      </p>
    </div>
  );
}