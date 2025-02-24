import { useEffect, useState } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { getProblemInfo } from '@/renderer/utils';

import { BOJ_DOMAIN } from '@/common/constants';

import { useWebviewController } from '../useWebviewController';
import { useTab } from '../useTab';
import { useProblem } from '../useProblem';

export function useWebview() {
  const [webview, setWebview] = useStore(useShallow((s) => [s.webview, s.setWebview]));
  const [startWebviewUrl, setStartWebviewUrl] = useState(useStore.getState().webviewUrl);

  const { addProblemTab } = useTab();
  const { updateProblem } = useProblem();
  const { updateWebviewUrl } = useWebviewController();

  /**
   * webview 상태 초기화
   */
  useEffect(() => {
    const newWebview = document.querySelector<Electron.WebviewTag>('webview');

    if (!newWebview) {
      return;
    }

    newWebview.addEventListener('dom-ready', () => {
      setWebview(newWebview);
    });
  }, [setWebview]);

  /**
   * 마지막 접속 url 반영
   */
  useEffect(() => {
    if (window.localStorage.getItem('webviewUrl')) {
      const startUrl = window.localStorage.getItem('webviewUrl');

      if (typeof startUrl === 'string') {
        setStartWebviewUrl(startUrl);
      }
    }
  }, []);

  /**
   * webview 새로고침 ipc 이벤트 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('reload-webview', () => {
      if (webview) {
        webview.reload();
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('reload-webview');
    };
  }, [webview]);

  /**
   * webview url 변경 이벤트 초기화
   */
  useEffect(() => {
    if (!webview) {
      return () => {};
    }

    const handleWebviewDidFinishLoad = async () => {
      const url = webview.getURL() || '';

      updateWebviewUrl(url);

      if (!url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        updateProblem(null);
        return;
      }

      const html = await webview.executeJavaScript('document.documentElement.outerHTML');

      /**
       * 실제 url과 webview.getURL() 값이 다를 수 있어 해당 방식을 사용
       */
      const realUrl = await webview.executeJavaScript('window.location.href');

      const problemInfo = getProblemInfo(html, realUrl);

      if (!problemInfo) {
        return;
      }

      updateProblem(problemInfo);
      addProblemTab(problemInfo);
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);

    return () => {
      webview.removeEventListener('did-finish-load', handleWebviewDidFinishLoad);
    };
  }, [webview, updateWebviewUrl, updateProblem, addProblemTab]);

  return {
    webview,
    startWebviewUrl,
  };
}
