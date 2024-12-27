import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { BOJ_DOMAIN } from '@/constants';
import * as cheerio from 'cheerio';

const getProblemInfo = (bojProblemHtml: string, url: string): ProblemInfo => {
  const $ = cheerio.load(bojProblemHtml);

  const number = (new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url) || [])[1] || '';
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

  return problemInfo;
};

export function BojView() {
  const [isDrag] = useStore(useShallow((s) => [s.isDrag]));
  const [webview, setWebView] = useStore(useShallow((s) => [s.webview, s.setWebview]));
  const [webviewUrl, setWebviewUrl] = useStore(useShallow((s) => [s.webviewUrl, s.setWebViewUrl]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));
  const [addProblemHistory] = useStore(useShallow((s) => [s.addProblemHistory]));

  const [startUrl] = useState(webviewUrl);

  useEffect(() => {
    setWebView(document.querySelector('webview') as Electron.WebviewTag);
  }, [setWebView]);

  useEffect(() => {
    if (!webview) {
      return;
    }

    const handleWebviewDidFinishLoad = async () => {
      const url = webview.getURL() || '';

      setWebviewUrl(url);

      if (!url.startsWith(`https://${BOJ_DOMAIN}/problem/`)) {
        setProblem(null);
        return;
      }

      const html = await webview.executeJavaScript('document.documentElement.outerHTML');

      const problemInfo = getProblemInfo(html, url);

      setProblem(problemInfo);
      addProblemHistory(problemInfo);
    };

    webview.addEventListener('did-finish-load', handleWebviewDidFinishLoad);
  }, [webview, setWebviewUrl, setProblem, addProblemHistory]);

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
        src={startUrl}
      />
    </div>
  );
}
