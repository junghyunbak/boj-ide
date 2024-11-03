import { css } from '@emotion/css';

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

  return (
    <div
      className={css`
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        border-bottom: 1px solid black;
        background-color: white;
        display: flex;
        align-items: center;
      `}
    >
      <button type="button" onClick={handleGoBackButtonClick}>
        {'<-'}
      </button>

      <button type="button" onClick={handleGoFrontButtonClick}>
        {'->'}
      </button>
    </div>
  );
}
