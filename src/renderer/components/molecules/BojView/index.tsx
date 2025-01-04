import { useEffect } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { BOJ_DOMAIN } from '@/common/constants';

import { useTab, useWebview } from '@/renderer/hooks';

import { getProblemInfo } from '@/renderer/utils';

export function BojView() {
  const [isResizerDrag] = useStore(useShallow((s) => [s.isResizerDrag]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const { webview, setWebview, updateWebviewUrl, startWebviewUrl } = useWebview();
  const { addTab } = useTab();

  useEffect(() => {
    setWebview(document.querySelector('webview') as Electron.WebviewTag);
  }, [setWebview]);

  useEffect(() => {
    if (!webview) {
      return () => {};
    }

    const handleWebviewDidFinishLoad = async () => {
      const url = webview.getURL() || '';

      updateWebviewUrl(url);

      if (!url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        setProblem(null);
        return;
      }

      const html = await webview.executeJavaScript('document.documentElement.outerHTML');

      const problemInfo = getProblemInfo(html, url);

      if (!problemInfo) {
        return;
      }

      setProblem(problemInfo);
      addTab(problemInfo);
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);

    return () => {
      webview.removeEventListener('did-finish-load', handleWebviewDidFinishLoad);
    };
  }, [webview, setProblem, addTab, updateWebviewUrl]);

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
        css={css`
          flex: 1;
          pointer-events: ${isResizerDrag ? 'none' : 'auto'};
        `}
        src={startWebviewUrl}
      />
    </div>
  );
}
