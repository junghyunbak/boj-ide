import { css } from '@emotion/react';

import { useWebviewController, useWebviewNavigation } from '@/renderer/hooks';

import { ArrowButton } from '@/renderer/components/atoms/buttons/ArrowButton';
import { RefreshButton } from '@/renderer/components/atoms/buttons/RefreshButton';
import { ExternalLinkButton } from '@/renderer/components/atoms/buttons/ExternalLinkButton';

export function WebviewController() {
  const { canGoBack, canGoForward } = useWebviewNavigation();
  const { goBack, goForward, reload, openExternal } = useWebviewController();

  const handleGoBackButtonClick = () => {
    goBack();
  };

  const handleGoFrontButtonClick = () => {
    goForward();
  };

  const handleRefreshButtonClick = () => {
    reload();
  };

  const handleOpenBrowserButtonClick = () => {
    openExternal();
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
