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
import { useWebview } from '../useWebview';

export function useEventWebview() {
  const { webview } = useWebview();
  const emotionTheme = useTheme();

  const [setCanGoBack] = useStore(useShallow((s) => [s.setCanGoBack]));
  const [setCanGoForward] = useStore(useShallow((s) => [s.setCanGoForward]));

  const { refreshWebviewTheme, updateWebviewLoading, updateWebviewUrl, updateStartUrl } = useModifyWebview();
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
      const url = webview.getURL() || '';

      await refreshWebviewTheme(emotionTheme);

      updateWebviewLoading('finished');
      updateWebviewUrl(url);
      updateStartUrl(url);

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
    updateStartUrl,
  ]);

  /**
   * deep link를 통해 열렸는지 여부 확인
   */
  useEffect(() => {
    if (!webview) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('open-deep-link', { data: undefined });
  }, [webview]);

  /**
   * 웹 뷰 히스토리 관련 상태 업데이트
   *
   * - 뒤로 가기
   * - 앞으로 가기
   */
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
