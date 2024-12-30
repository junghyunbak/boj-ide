import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { BOJ_DOMAIN } from '@/constants';
import { useTab, useWebview } from '@/renderer/hooks';
import * as cheerio from 'cheerio';

export function BojView() {
  const [isDrag] = useStore(useShallow((s) => [s.isDrag]));
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
          pointer-events: ${isDrag ? 'none' : 'auto'};
        `}
        src={startWebviewUrl}
      />
    </div>
  );
}

function getProblemInfo(bojProblemHtml: string, url: string): ProblemInfo {
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
}
