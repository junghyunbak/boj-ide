import { useEffect, useState, useCallback, useRef } from 'react';

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
  const [webviewIsLoading] = useStore(useShallow((s) => [s.webviewIsLoading]));

  const [startWebviewUrl, setStartWebviewUrl] = useState(webviewUrl);

  const emotionTheme = useEmotionTheme();
  const { theme } = useTheme();
  const { addProblemTab } = useTab();
  const { updateProblem } = useProblem();
  const { updateWebviewUrl, updateWebviewLoading } = useWebviewController();

  const insertCSSKeyRef = useRef<string>('');

  const refreshWebviewTheme = useCallback(async () => {
    if (!webview) {
      return;
    }

    if (insertCSSKeyRef.current) {
      webview.removeInsertedCSS(insertCSSKeyRef.current);
    }

    if (theme === 'programmers' && isBojProblemUrl(webviewUrl)) {
      const bojOverrideStyle = css`
        html,
        .wrapper {
          background: ${emotionTheme.colors.bg} !important;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: ${emotionTheme.colors.primaryfg} !important;
        }

        .headline h2,
        .headline h3,
        .headline h4 {
          border-color: ${emotionTheme.colors.primarybg} !important;
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

        pre,
        code,
        .sampledata {
          background-color: ${emotionTheme.colors.code} !important;
          border: ${emotionTheme.colors.border} !important;
          color: ${emotionTheme.colors.fg} !important;
        }

        .btn-default {
          color: ${emotionTheme.colors.fg} !important;
          border-color: ${emotionTheme.colors.primarybg} !important;
          background-color: ${emotionTheme.colors.primarybg} !important;
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

      insertCSSKeyRef.current = await webview.insertCSS(bojOverrideStyle);
    }
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

    const handleWebviewDomReady = async () => {
      setWebview(newWebview);

      /**
       * 백준 허브 확장 프로그램에서 삽입되는 기본 스타일로 인한
       * 리스트 태그 패딩값이 사라지는 문제를 해결하기 위한 코드
       */
      await newWebview.insertCSS(css`
        ol,
        ul:not(.nav),
        dl {
          padding-left: 40px;
        }
      `.styles);
    };

    const handleWebviewWillNavigate = () => {
      updateWebviewLoading('loading');
    };

    newWebview.addEventListener('dom-ready', handleWebviewDomReady);
    newWebview.addEventListener('will-navigate', handleWebviewWillNavigate);

    return function cleanup() {
      newWebview.removeEventListener('dom-ready', handleWebviewDomReady);
      newWebview.removeEventListener('will-navigate', handleWebviewWillNavigate);
    };
  }, [setWebview, updateWebviewLoading]);

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
      await refreshWebviewTheme();
      updateWebviewLoading('finished');

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
  }, [
    webview,
    updateWebviewUrl,
    updateProblem,
    addProblemTab,
    refreshWebviewTheme,
    webviewIsLoading,
    updateWebviewLoading,
  ]);

  return {
    webview,
    webviewIsLoading,
    startWebviewUrl,
    refreshWebviewTheme,
  };
}
