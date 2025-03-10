import { useEffect } from 'react';

import { useTheme } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { isBojProblemUrl, getProblemInfo } from '@/renderer/utils';

import { useEventIpc } from '../useEventIpc';
import { useModifyWebview } from '../useModifyWebview';
import { useModifyProblem } from '../useModifyProblem';
import { useModifyTab } from '../useModifyTab';
import { useModifyHistories } from '../useModifyHistories';

export function useEventWebview() {
  const [webview] = useStore(useShallow((s) => [s.webview]));
  const [setCanGoBack] = useStore(useShallow((s) => [s.setCanGoBack]));
  const [setCanGoForward] = useStore(useShallow((s) => [s.setCanGoForward]));

  const emotionTheme = useTheme();

  const { refreshWebviewTheme, updateWebviewLoading, updateWebviewUrl } = useModifyWebview();
  const { updateProblem } = useModifyProblem();
  const { addProblemTab } = useModifyTab();
  const { addHistory } = useModifyHistories();

  /**
   * 테마가 변경될 때 마다 웹뷰 스타일 갱신
   */
  useEffect(() => {
    refreshWebviewTheme(emotionTheme);
  }, [emotionTheme, refreshWebviewTheme]);

  /**
   * webview 새로고침 ipc 이벤트 초기화
   */
  useEventIpc(
    () => {
      if (webview) {
        webview.reload();
      }
    },
    [webview],
    'reload-webview',
  );

  /**
   * webview url 변경 이벤트 초기화
   */
  useEffect(() => {
    if (!webview) {
      return function cleanup() {};
    }

    const handleWebviewDidFinishLoad = async () => {
      await refreshWebviewTheme(emotionTheme);

      updateWebviewLoading('finished');

      const url = webview.getURL() || '';

      updateWebviewUrl(url);

      if (!isBojProblemUrl(url)) {
        updateProblem(null);
        return;
      }

      const html = await webview.executeJavaScript('document.documentElement.outerHTML');
      const realUrl = await webview.executeJavaScript('window.location.href');

      const problemInfo = getProblemInfo(html, realUrl);

      if (!problemInfo) {
        return;
      }

      updateProblem(problemInfo);
      addProblemTab(problemInfo);
      addHistory(problemInfo);
    };

    const handleWebviewWillNavigate = (event: Electron.WillNavigateEvent) => {
      if (isBojProblemUrl(event.url)) {
        updateWebviewLoading('loading');
      }
    };

    const handleWebviewDidFailLoad = () => {
      updateWebviewLoading('finished');
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);
    webview.addEventListener('did-fail-load', handleWebviewDidFailLoad);
    webview.addEventListener('will-navigate', handleWebviewWillNavigate);

    return function cleanup() {
      webview.removeEventListener('did-finish-load', handleWebviewDidFinishLoad);
      webview.removeEventListener('did-fail-load', handleWebviewDidFailLoad);
      webview.removeEventListener('will-navigate', handleWebviewWillNavigate);
    };
  }, [
    webview,
    updateWebviewUrl,
    updateProblem,
    addProblemTab,
    addHistory,
    refreshWebviewTheme,
    updateWebviewLoading,
    emotionTheme,
  ]);

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
  }, [webview, setCanGoBack, setCanGoForward]);
}
