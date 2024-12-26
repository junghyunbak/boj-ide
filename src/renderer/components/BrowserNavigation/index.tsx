import { ReactComponent as LeftArrow } from '@/renderer/assets/svgs/left-arrow.svg';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { BrowserNavigationHistoryBox, BrowserNavigationHistoryButton, BrowserNavigationLayout } from './index.styles';

// browser navigation -> nav
export function BrowserNavigation() {
  const [webView] = useStore(useShallow((s) => [s.webView]));

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  useEffect(() => {
    if (!webView) {
      return;
    }

    webView.addEventListener('did-finish-load', () => {
      setCanGoBack(webView.canGoBack());
      setCanGoForward(webView.canGoForward());
    });
  }, [webView]);

  const handleGoBackButtonClick = () => {
    if (webView) {
      webView.goBack();
    }
  };

  const handleGoFrontButtonClick = () => {
    if (webView) {
      webView.goForward();
    }
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
    </BrowserNavigationLayout>
  );
}
