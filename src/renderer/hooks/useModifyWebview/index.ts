import { useCallback } from 'react';

import { type Theme } from '@emotion/react';

import { createWebviewInlineStyle, scrollbarStyle } from '@/renderer/styles';

import { isBojProblemUrl } from '@/renderer/utils';

import { BOJ_DOMAIN } from '@/common/constants';
import { WEBVIEW_HOME_URL } from '@/renderer/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useModifyWebview() {
  const [setWebviewUrl] = useStore(useShallow((s) => [s.setWebViewUrl]));
  const [setWebviewIsLoading] = useStore(useShallow((s) => [s.setWebviewIsLoading]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));
  const [setStartUrl] = useStore(useShallow((s) => [s.setStartUrl]));
  const [setWebview] = useStore(useShallow((s) => [s.setWebview]));

  const updateWebview = useCallback(
    (webview: Electron.WebviewTag) => {
      setWebview(webview);
    },
    [setWebview],
  );

  const updateStartUrl = useCallback(
    (url: string) => {
      if (url.startsWith('chrome-extension://')) {
        return;
      }

      setStartUrl(url);
    },
    [setStartUrl],
  );

  const refreshWebviewTheme = useCallback(async (emotionTheme: Theme) => {
    const { webview, theme, insertCSSKey } = useStore.getState();

    if (!webview) {
      return;
    }

    if (insertCSSKey) {
      webview.removeInsertedCSS(insertCSSKey);
    }

    if (!isBojProblemUrl(webview.getURL())) {
      return;
    }

    // BUG: `cssKey` 변수 없이 곧바로 대입 시 비동기처리 되지 않는 이슈 존재
    // 더 나은 구조로 변경 필요
    const cssKey =
      theme === 'baekjoon'
        ? await webview.insertCSS(scrollbarStyle(emotionTheme).styles)
        : await webview.insertCSS(createWebviewInlineStyle(emotionTheme));

    useStore.getState().insertCSSKey = cssKey;
  }, []);

  const updateWebviewUrl = useCallback(
    (url: string) => {
      setWebviewUrl(url);
    },
    [setWebviewUrl],
  );

  const updateWebviewLoading = useCallback(
    (state: 'loading' | 'finished') => {
      setWebviewIsLoading(state === 'loading');
    },
    [setWebviewIsLoading],
  );

  const gotoProblem = useCallback(
    (problemInfo: ProblemInfo): boolean => {
      const { problem, webview } = useStore.getState();

      if (!webview) {
        return false;
      }

      if (problem && problem.number === problemInfo.number) {
        return false;
      }

      const url = `https://${BOJ_DOMAIN}/problem/${problemInfo.number}`;

      updateWebviewLoading('loading');
      updateWebviewUrl(url);
      setProblem(problemInfo);

      webview.loadURL(url).catch(console.error);

      return true;
    },
    [updateWebviewLoading, setProblem, updateWebviewUrl],
  );

  const gotoUrl = useCallback(
    (url: string): boolean => {
      const { webview } = useStore.getState();

      if (!webview) {
        return false;
      }

      updateWebviewLoading('loading');
      updateWebviewUrl(url);
      setProblem(null);

      webview.loadURL(url).catch(console.error);

      return true;
    },
    [setProblem, updateWebviewUrl, updateWebviewLoading],
  );

  const goBack = useCallback(() => {
    updateWebviewLoading('loading');
    useStore.getState().webview?.goBack();
  }, [updateWebviewLoading]);

  const goForward = useCallback(() => {
    updateWebviewLoading('loading');
    useStore.getState().webview?.goForward();
  }, [updateWebviewLoading]);

  const reload = useCallback(() => {
    updateWebviewLoading('loading');
    useStore.getState().webview?.reload();
  }, [updateWebviewLoading]);

  const openExternal = useCallback(() => {
    const { webview } = useStore.getState();
    window.open(webview ? webview.getURL() : WEBVIEW_HOME_URL, '_blank');
  }, []);

  return {
    refreshWebviewTheme,
    gotoProblem,
    gotoUrl,
    goBack,
    goForward,
    reload,
    openExternal,
    updateStartUrl,
    updateWebviewUrl,
    updateWebviewLoading,
    updateWebview,
  };
}
