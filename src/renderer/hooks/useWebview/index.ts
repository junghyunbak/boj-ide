import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { BOJ_DOMAIN } from '@/common/constants';

export function useWebview() {
  const [webview, setWebview] = useStore(useShallow((s) => [s.webview, s.setWebview]));
  const [setWebviewUrl] = useStore(useShallow((s) => [s.setWebViewUrl]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const updateWebviewUrl = (url: string) => {
    /**
     * zustand persist를 사용하지 않는 이유
     * : chrome-extsion:// 으로 시작하는 url을 마지막 접속 url에서 거르기 위함.
     */
    if (!url.startsWith('chrome-extension://')) {
      window.localStorage.setItem('webviewUrl', url);
    }

    setWebviewUrl(url);
  };

  const gotoProblem = (problemInfo: ProblemInfo) => {
    if (problemInfo.number === useStore.getState().problem?.number) {
      return;
    }

    const url = `https://${BOJ_DOMAIN}/problem/${problemInfo.number}`;
    webview?.loadURL(url).catch(console.log);

    /**
     * 낙관적 업데이트
     */
    setProblem(problemInfo);
    updateWebviewUrl(url);
  };

  const gotoUrl = (url: string) => {
    webview?.loadURL(url).catch(console.log);

    /**
     * 낙관적 업데이트
     */
    setProblem(null);
    updateWebviewUrl(url);
  };

  return {
    webview,
    setWebview,
    gotoUrl,
    gotoProblem,
    updateWebviewUrl,
  };
}
