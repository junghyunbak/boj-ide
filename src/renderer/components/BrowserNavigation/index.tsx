import { css } from '@emotion/react';
import { ReactComponent as LeftArrow } from '@/renderer/assets/svgs/left-arrow.svg';
import { color } from '@/styles';
import {
  BrowserNavigationBookmarkBox,
  BrowserNavigationBookmarkButton,
  BrowserNavigationHistoryBox,
  BrowserNavigationHistoryButton,
  BrowserNavigationLayout,
} from './index.styles';

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
    <BrowserNavigationLayout>
      <BrowserNavigationHistoryBox>
        <BrowserNavigationHistoryButton type="button" onClick={handleGoBackButtonClick} aria-label="go-back-button">
          <LeftArrow />
        </BrowserNavigationHistoryButton>

        <BrowserNavigationHistoryButton
          type="button"
          onClick={handleGoFrontButtonClick}
          aria-label="go-front-button"
          horizontalFlip
        >
          <LeftArrow />
        </BrowserNavigationHistoryButton>
      </BrowserNavigationHistoryBox>

      <BrowserNavigationBookmarkBox>
        <BrowserNavigationBookmarkButton
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
        </BrowserNavigationBookmarkButton>

        <BrowserNavigationBookmarkButton
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
        </BrowserNavigationBookmarkButton>
      </BrowserNavigationBookmarkBox>
    </BrowserNavigationLayout>
  );
}
