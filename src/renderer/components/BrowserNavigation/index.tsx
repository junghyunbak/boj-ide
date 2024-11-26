import { css } from '@emotion/react';

import { color, size } from '../../../styles';

export function BrowserNavigation() {
  /**
   * 일단 히스토리의 존재 여부와는 상관없이 메세지 보내도록 구현
   */
  const handleGoBackButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('go-back-boj-view');
  };

  const handleGoFrontButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('go-front-boj-view');
  };

  const handleGoSolvedAcButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('go-page', { data: 'solved.ac' });
  };

  const handleGoBaekjoonButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('go-page', { data: 'baekjoon' });
  };

  return (
    <div
      css={css`
        width: 100%;
        height: ${size.BOJ_VIEW_NAVIGATION_HEIGHT}px;
        box-sizing: border-box;
        border-bottom: 1px solid lightgray;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.5rem;
        overflow: hidden;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;

          gap: 0.2rem;

          button {
            border: none;
            width: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            cursor: pointer;
            border-radius: 9999px;
            transition: all ease 0.2s;
            background-color: transparent;
            padding: 0.5rem;

            &:hover {
              background-color: #ececec;
            }

            svg {
              width: 100%;
              color: gray;
            }
          }
        `}
      >
        <button type="button" onClick={handleGoBackButtonClick} aria-label="go-back-button">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z" />
            <path
              fill="currentColor"
              d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleGoFrontButtonClick}
          aria-label="go-front-button"
          css={css`
            transform: rotate(180deg);
          `}
        >
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z" />
            <path
              fill="currentColor"
              d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"
            />
          </svg>
        </button>
      </div>

      <div
        css={css`
          display: flex;

          button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.4rem 0.8rem;

            &:hover {
              background-color: rgba(0, 0, 0, 0.1);
            }
          }
        `}
      >
        <button
          type="button"
          onClick={handleGoSolvedAcButtonClick}
          css={css`
            font-weight: bolder;

            span {
              color: white;
              background-color: #00cb00;
              border-radius: 0.4rem;
              padding: 0.1rem 0.5rem;
            }
          `}
        >
          solved.<span>AC</span>
        </button>
        <button
          type="button"
          onClick={handleGoBaekjoonButtonClick}
          css={css`
            color: ${color.text};
            letter-spacing: 0.1rem;
            font-weight: 500;

            span {
              color: ${color.primaryText};
            }
          `}
        >
          BAE<span>{'/<'}</span>JOON<span>{'>'}</span>
        </button>
      </div>
    </div>
  );
}
