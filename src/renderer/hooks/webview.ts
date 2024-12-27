import { BOJ_DOMAIN } from '@/constants';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useWebviewRoute() {
  const [webview] = useStore(useShallow((s) => [s.webview]));
  const [setWebViewUrl] = useStore(useShallow((s) => [s.setWebViewUrl]));
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const gotoProblem = (problemInfo: ProblemInfo) => {
    const url = `https://${BOJ_DOMAIN}/problem/${problemInfo.number}`;
    webview?.loadURL(url);

    /**
     * 낙관적 업데이트
     */
    setProblem(problemInfo);
    setWebViewUrl(url);
  };

  const gotoUrl = (url: string) => {
    webview?.loadURL(url);

    /**
     * 낙관적 업데이트
     */
    setProblem(null);
    setWebViewUrl(url);
  };

  return {
    gotoUrl,
    gotoProblem,
  };
}
