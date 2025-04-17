import { css } from '@emotion/react';

import { useModifyTab, useModifyWebview, useWebview } from '@/renderer/hooks';

import { ArrowButton } from '@/renderer/components/atoms/buttons/ArrowButton';
import { RefreshButton } from '@/renderer/components/atoms/buttons/RefreshButton';
import { ExternalLinkButton } from '@/renderer/components/atoms/buttons/ExternalLinkButton';
import { BookmarkButton } from '@/renderer/components/atoms/buttons/BookmarkButton';

export function WebviewController() {
  const { canGoBack, canGoForward, webview } = useWebview();

  const { goBack, goForward, reload, openExternal } = useModifyWebview();

  const { addBookmarkTab } = useModifyTab();

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

  const handleBookmarkAddButtonClick = () => {
    if (!webview) {
      return;
    }

    const bookmarkInfo: BookmarkInfo = {
      url: webview.getURL(),
      title: webview.getTitle(),
      custom: true,
    };

    addBookmarkTab(bookmarkInfo);
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
      <BookmarkButton onClick={handleBookmarkAddButtonClick} />
    </div>
  );
}
