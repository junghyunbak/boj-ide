import { useEffect } from 'react';

import { useModifyWebview } from '../useModifyWebview';

export function useSetupWebview() {
  const { updateWebview } = useModifyWebview();

  /**
   * webview 상태 초기화
   */
  useEffect(() => {
    const newWebview = document.querySelector<Electron.WebviewTag>('webview');

    if (!newWebview) {
      return function cleanup() {};
    }

    const handleWebviewDomReady = async () => {
      updateWebview(newWebview);
    };

    newWebview.addEventListener('dom-ready', handleWebviewDomReady);

    return function cleanup() {
      newWebview.removeEventListener('dom-ready', handleWebviewDomReady);
    };
  }, [updateWebview]);
}
