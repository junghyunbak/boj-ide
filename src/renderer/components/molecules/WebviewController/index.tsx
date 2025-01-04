import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { useWebview } from '@/renderer/hooks';

import { ArrowButton } from '@/renderer/components/atoms/buttons/ArrowButton';
import { RefreshButton } from '@/renderer/components/atoms/buttons/RefreshButton';
import { ExternalLinkButton } from '@/renderer/components/atoms/buttons/ExternalLinkButton';

export function WebviewController() {
  const { webview } = useWebview();

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  useEffect(() => {
    if (!webview) {
      return () => {};
    }

    const handleWebviewDidFinishLoad = () => {
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);

    return () => {
      webview.removeEventListener('did-finish-load', handleWebviewDidFinishLoad);
    };
  }, [webview]);

  const handleGoBackButtonClick = () => {
    webview?.goBack();
  };

  const handleGoFrontButtonClick = () => {
    webview?.goForward();
  };

  const handleRefreshButtonClick = () => {
    webview?.reload();
  };

  const handleOpenBrowserButtonClick = () => {
    window.open(webview?.getURL(), '_blank');
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
      <RefreshButton onClick={handleRefreshButtonClick} />
      <ExternalLinkButton onClick={handleOpenBrowserButtonClick} />
    </div>
  );
}
