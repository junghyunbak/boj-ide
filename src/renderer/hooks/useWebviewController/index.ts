import { useCallback } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { BOJ_DOMAIN } from '@/common/constants';

export function useWebviewController() {
  const [setWebviewUrl] = useStore(useShallow((s) => [s.setWebViewUrl]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const updateWebviewUrl = useCallback(
    (url: string) => {
      /**
       * zustand persist를 사용하지 않는 이유
       * : chrome-extsion:// 으로 시작하는 url을 마지막 접속 url에서 거르기 위함.
       */
      if (!url.startsWith('chrome-extension://')) {
        window.localStorage.setItem('webviewUrl', url);
      }

      setWebviewUrl(url);
    },
    [setWebviewUrl],
  );

  const gotoProblem = useCallback(
    (problemInfo: ProblemInfo): boolean => {
      const { problem, webview } = useStore.getState();

      if (!webview) {
        return false;
      }

      if (problem && problem.number === problemInfo.number) {
        return false;
      }

      const url = `https://${BOJ_DOMAIN}/problem/${problemInfo.number}`;

      /**
       * 낙관적 업데이트
       */
      setProblem(problemInfo);
      updateWebviewUrl(url);

      webview.loadURL(url).catch(console.error);

      return true;
    },
    [setProblem, updateWebviewUrl],
  );

  const gotoUrl = useCallback(
    (url: string): boolean => {
      const { webview } = useStore.getState();

      if (!webview) {
        return false;
      }

      /**
       * 낙관적 업데이트
       */
      setProblem(null);
      updateWebviewUrl(url);

      webview.loadURL(url).catch(console.error);

      return true;
    },
    [setProblem, updateWebviewUrl],
  );

  return {
    gotoProblem,
    gotoUrl,
    updateWebviewUrl,
  };
}
