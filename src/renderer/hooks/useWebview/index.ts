import { useEffect, useState, useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { css, useTheme as useEmotionTheme } from '@emotion/react';

import { getProblemInfo, isBojProblemUrl } from '@/renderer/utils';

import { useWebviewController } from '../useWebviewController';
import { useTab } from '../useTab';
import { useProblem } from '../useProblem';
import { useTheme } from '../useTheme';

export function useWebview() {
  const [webview, setWebview] = useStore(useShallow((s) => [s.webview, s.setWebview]));
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));
  const [startWebviewUrl, setStartWebviewUrl] = useState(webviewUrl);

  const emotionTheme = useEmotionTheme();
  const { theme } = useTheme();
  const { addProblemTab } = useTab();
  const { updateProblem } = useProblem();
  const { updateWebviewUrl } = useWebviewController();

  const refreshWebviewTheme = useCallback(() => {
    if (!webview) {
      return;
    }

    const customStyleDivId = 'custom-style';

    const bojOverrideStyle = css`
      html,
      .wrapper {
        background: ${emotionTheme.colors.bg};
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: ${emotionTheme.colors.primaryfg};
      }

      .headline h2,
      .headline h3,
      .headline h4 {
        border-color: ${emotionTheme.colors.primarybg};
      }

      body,
      li,
      a,
      p {
        color: ${emotionTheme.colors.fg} !important;
      }

      .active a {
        background-color: ${emotionTheme.colors.primarybg} !important;
      }

      .header,
      .page-header,
      .table-responsive,
      .table,
      .table *,
      .headline {
        border-color: ${emotionTheme.colors.border} !important;
      }

      .sampledata {
        background-color: ${emotionTheme.colors.code};
        border: ${emotionTheme.colors.border};
        color: ${emotionTheme.colors.fg};
      }

      .btn-default {
        color: ${emotionTheme.colors.fg};
        border-color: ${emotionTheme.colors.primarybg};
        background-color: ${emotionTheme.colors.primarybg};
      }

      *::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }

      *::-webkit-scrollbar-thumb {
        background: ${emotionTheme.colors.scrollbar};
      }

      *::-webkit-scrollbar-track {
        background: ${emotionTheme.colors.bg};
      }

      *::-webkit-scrollbar-corner {
        background: ${emotionTheme.colors.bg};
      }
    `.styles;

    webview
      .executeJavaScript(
        `
      (() => {
        const $newStyleDiv = document.createElement('div');
        $newStyleDiv.id = '${customStyleDivId}';

        const $customStyleDiv = document.querySelector('#${customStyleDivId}');

        if($customStyleDiv) {
          $customStyleDiv.remove();
        }

        $newStyleDiv.innerHTML = \`
          <style>
            ${bojOverrideStyle}
          </style>
        \`;

        if(${theme === 'programmers'} && ${isBojProblemUrl(webviewUrl)}) {
          document.body.appendChild($newStyleDiv);
        }
      })();
    `,
      )
      .catch(console.log);
  }, [webview, webviewUrl, theme, emotionTheme]);

  /**
   * 테마가 변경될 때 마다 웹뷰 스타일 갱신
   */
  useEffect(() => {
    refreshWebviewTheme();
  }, [refreshWebviewTheme]);

  /**
   * webview 상태 초기화
   */
  useEffect(() => {
    const newWebview = document.querySelector<Electron.WebviewTag>('webview');

    if (!newWebview) {
      return function cleanup() {};
    }

    const handleWebviewDomReady = () => {
      setWebview(newWebview);

      /**
       * 백준 허브 확장 프로그램에서 삽입되는 기본 스타일로 인한
       * 리스트 태그 패딩값이 사라지는 문제를 해결하기 위한 코드
       */
      newWebview.insertCSS(css`
        ol,
        ul:not(.nav),
        dl {
          padding-left: 40px;
        }
      `.styles);
    };

    newWebview.addEventListener('dom-ready', handleWebviewDomReady);

    return function cleanup() {
      newWebview.removeEventListener('dom-ready', handleWebviewDomReady);
    };
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
      refreshWebviewTheme();

      const url = webview.getURL() || '';

      updateWebviewUrl(url);

      if (!isBojProblemUrl(url)) {
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
  }, [webview, updateWebviewUrl, updateProblem, addProblemTab, refreshWebviewTheme]);

  return {
    webview,
    startWebviewUrl,
    refreshWebviewTheme,
  };
}
