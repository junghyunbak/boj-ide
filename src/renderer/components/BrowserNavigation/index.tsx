import { useEffect, useState } from 'react';
import { ReactComponent as LeftArrow } from '@/renderer/assets/svgs/left-arrow.svg';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { css } from '@emotion/react';
import { useSubmitList } from '@/renderer/hooks';
import { BrowserNavigationHistoryBox, BrowserNavigationHistoryButton, BrowserNavigationLayout } from './index.styles';
import { SubmitCodeButton } from '../Header/SubmitCodeButton';

// browser navigation -> nav
export function BrowserNavigation() {
  const [webview] = useStore(useShallow((s) => [s.webview]));
  const [submitListIsOpen] = useStore(useShallow((s) => [s.submitListIsOpen]));

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  const { closeSumbitList, openSubmitList } = useSubmitList();

  useEffect(() => {
    if (!webview) {
      return;
    }

    webview.addEventListener('did-finish-load', () => {
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
    });
  }, [webview]);

  const handleGoBackButtonClick = () => {
    webview?.goBack();
  };

  const handleGoFrontButtonClick = () => {
    webview?.goForward();
  };

  return (
    <BrowserNavigationLayout>
      <BrowserNavigationHistoryBox>
        <BrowserNavigationHistoryButton
          type="button"
          onClick={handleGoBackButtonClick}
          aria-label="go-back-button"
          disabled={!canGoBack}
        >
          <LeftArrow />
        </BrowserNavigationHistoryButton>

        <BrowserNavigationHistoryButton
          type="button"
          onClick={handleGoFrontButtonClick}
          aria-label="go-front-button"
          horizontalFlip
          disabled={!canGoForward}
        >
          <LeftArrow />
        </BrowserNavigationHistoryButton>
      </BrowserNavigationHistoryBox>

      <div
        css={css`
          display: flex;
          gap: 0.5rem;
        `}
      >
        <button
          type="button"
          onClick={() => (submitListIsOpen ? closeSumbitList() : openSubmitList())}
          css={css`
            border: 1px solid lightgray;
            background: none;
            padding: 0.4rem 0.8rem;
            font-weight: 500;
            cursor: pointer;
          `}
        >
          제출 내역
        </button>
        <SubmitCodeButton />
      </div>
    </BrowserNavigationLayout>
  );
}
