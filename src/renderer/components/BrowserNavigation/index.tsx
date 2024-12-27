import { ReactComponent as LeftArrow } from '@/renderer/assets/svgs/left-arrow.svg';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { BrowserNavigationHistoryBox, BrowserNavigationHistoryButton, BrowserNavigationLayout } from './index.styles';
import { SubmitCodeButton } from '../Header/SubmitCodeButton';

// browser navigation -> nav
export function BrowserNavigation() {
  const [webview] = useStore(useShallow((s) => [s.webview]));

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

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

      <SubmitCodeButton />
    </BrowserNavigationLayout>
  );
}
