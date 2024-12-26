import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function BojView() {
  const [url] = useStore(useShallow((s) => [s.url]));
  const [isDrag] = useStore(useShallow((s) => [s.isDrag]));
  const [webview, setWebView] = useStore(useShallow((s) => [s.webView, s.setWebView]));

  useEffect(() => {
    setWebView(document.querySelector('webview') as Electron.WebviewTag);
  }, [setWebView]);

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
          pointer-events: ${isDrag ? 'none' : 'auto'};
        `}
        src={url}
      />
    </div>
  );
}
