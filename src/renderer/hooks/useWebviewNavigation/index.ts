import { useState, useEffect, useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { WEBVIEW_HOME_URL } from '@/renderer/constants';

import { useWebviewController } from '../useWebviewController';

export function useWebviewNavigation() {
  const [webview] = useStore(useShallow((s) => [s.webview]));

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  const { updateWebviewLoading } = useWebviewController();

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

  const goBack = useCallback(() => {
    updateWebviewLoading('loading');
    webview?.goBack();
  }, [webview, updateWebviewLoading]);

  const goForward = useCallback(() => {
    updateWebviewLoading('loading');
    webview?.goForward();
  }, [webview, updateWebviewLoading]);

  const reload = useCallback(() => {
    updateWebviewLoading('loading');
    webview?.reload();
  }, [webview, updateWebviewLoading]);

  const openExternal = useCallback(() => {
    window.open(webview ? webview.getURL() : WEBVIEW_HOME_URL, '_blank');
  }, [webview]);

  return {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    reload,
    openExternal,
  };
}
