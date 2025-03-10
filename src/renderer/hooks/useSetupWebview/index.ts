import { useEffect, useState } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useSetupWebview() {
  const [setWebview] = useStore(useShallow((s) => [s.setWebview]));

  // TODO: 시작 url 리렌더링 시 변경되지 않도록 구현
  // TODO: 지역 상태 종속성 제거
  const [startWebviewUrl, setStartWebviewUrl] = useState(useStore.getState().webviewUrl);

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

  return {
    startWebviewUrl,
  };
}
