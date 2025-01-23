import { useEffect } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { BOJ_DOMAIN } from '@/common/constants';

import { useProblem, useTab, useWebview } from '@/renderer/hooks';

import { getProblemInfo } from '@/renderer/utils';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));

  const { updateProblem } = useProblem();
  const { addTab } = useTab();
  const { webview, startWebviewUrl, setWebview, updateWebviewUrl } = useWebview();

  useEffect(() => {
    const newWebview = document.querySelector('webview') as Electron.WebviewTag;

    newWebview.addEventListener('dom-ready', () => {
      setWebview(newWebview);
    });
  }, [setWebview]);

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

      const problemInfo = getProblemInfo(html, url);

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
