import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { BOJ_DOMAIN } from '@/constants';
import * as cheerio from 'cheerio';

export function BojView() {
  const [webViewUrl] = useStore(useShallow((s) => [s.url]));
  const [isDrag] = useStore(useShallow((s) => [s.isDrag]));
  const [webview, setWebView] = useStore(useShallow((s) => [s.webView, s.setWebView]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));
  const [addProblemHistory] = useStore(useShallow((s) => [s.addProblemHistory]));

  useEffect(() => {
    setWebView(document.querySelector('webview') as Electron.WebviewTag);
  }, [setWebView]);

  useEffect(() => {
    if (!webview) {
      return;
    }

    webview.addEventListener('did-finish-load', async () => {
      const url = webview.getURL() || '';

      if (!url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        setProblem(null);
        // setUrl(url); [ ]: 좀 중복된다. (브라우저 내에서 url이동 시)
        return;
      }

      const html = await webview.executeJavaScript('document.documentElement.outerHTML');

      const $ = cheerio.load(html);

      const [_, number] = new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url) || [];

      const name = $('#problem_title').html() || '';

      const inputDesc = $('#problem_input').html() || '';

      const inputs = Array.from($('[id|="sample-input"]'))
        .map((v) => {
          const [child] = v.children;

          if ('data' in child) {
            return child.data;
          }

          return '';
        })
        .filter((v) => v !== null);

      const outputs = Array.from($('[id|="sample-output"]'))
        .map((v) => {
          const [child] = v.children;

          if ('data' in child) {
            return child.data;
          }

          return '';
        })
        .filter((v) => v !== null);

      const problemInfo: ProblemInfo = {
        name,
        number,
        inputDesc,
        testCase: {
          inputs,
          outputs,
        },
      };

      setProblem(problemInfo);
      addProblemHistory(problemInfo);
    });
  }, [webview, setProblem, addProblemHistory]);

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
        src={webViewUrl}
      />
    </div>
  );
}
