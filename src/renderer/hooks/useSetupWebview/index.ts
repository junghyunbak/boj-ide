import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useSetupWebview() {
  const [setWebview] = useStore(useShallow((s) => [s.setWebview]));

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
}
