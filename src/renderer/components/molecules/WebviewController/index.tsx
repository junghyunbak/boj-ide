import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ArrowButton } from '@/renderer/components/atoms/buttons/ArrowButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function WebviewController() {
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
    <div
      css={css`
        display: flex;
        gap: 0.2rem;
      `}
    >
      <ArrowButton onClick={handleGoBackButtonClick} disabled={!canGoBack} />
      <ArrowButton onClick={handleGoFrontButtonClick} disabled={!canGoForward} direction="right" />
    </div>
  );
}
