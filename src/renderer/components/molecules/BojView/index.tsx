import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { BOJ_DOMAIN } from '@/common/constants';

import { useProblem, useTab, useWebview } from '@/renderer/hooks';

import { getProblemInfo } from '@/renderer/utils';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  const [startWebviewUrl, setStartWebviewUrl] = useState(useStore.getState().webviewUrl);

  const { updateProblem } = useProblem();
  const { addTab } = useTab();
  const { webview, setWebview, updateWebviewUrl } = useWebview();

  /**
   * webview 상태 초기화
   */
  useEffect(() => {
    const newWebview = document.querySelector('webview') as Electron.WebviewTag;

    newWebview.addEventListener('dom-ready', () => {
      setWebview(newWebview);
    });
  }, [setWebview]);

  /**
   * 마지막 접속 url 반영
   */
  useEffect(() => {
    if (window.localStorage.getItem('webviewUrl')) {
      setStartWebviewUrl(window.localStorage.getItem('webviewUrl') as string);
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
      addTab(problemInfo);
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);

    return () => {
      webview.removeEventListener('did-finish-load', handleWebviewDidFinishLoad);
    };
  }, [webview, addTab, updateWebviewUrl, updateProblem]);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <webview
        src={startWebviewUrl}
        style={{ flex: 1, pointerEvents: isResizerDrag ? 'none' : 'auto' }}
        // Warning: Received "true" for a non-boolean attribute 에러로 인해 @ts-ignore 추가
        // @ts-ignore
        allowpopups="true"
      />
    </div>
  );
}
