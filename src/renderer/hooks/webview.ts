import { BOJ_DOMAIN } from '@/constants';
import { useStore } from '@/renderer/store';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

export function useWebviewRoute() {
  const [webview, setWebview] = useStore(useShallow((s) => [s.webview, s.setWebview]));
  const [setWebviewUrl] = useStore(useShallow((s) => [s.setWebViewUrl]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const [startWebviewUrl] = useState(useStore.getState().webviewUrl);

  const updateWebviewUrl = (url: string) => {
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
    startWebviewUrl,
  };
}
