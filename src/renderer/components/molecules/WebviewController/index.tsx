import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { ArrowButton } from '@/renderer/components/atoms/buttons/ArrowButton';
import { ExternalLinkButton } from '@/renderer/components/atoms/buttons/ExternalLinkButton';
import { RefreshButton } from '@/renderer/components/atoms/buttons/RefreshButton';

export function WebviewController() {
  const [webview] = useStore(useShallow((s) => [s.webview]));

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
