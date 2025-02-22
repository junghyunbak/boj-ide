import { type StateCreator } from 'zustand';

import { WEBVIEW_HOME_URL } from '@/renderer/constants';

type BojViewSlice = {
  webviewUrl: string;
  setWebViewUrl: (url: string) => void;

  isResizerDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;

  webview: Electron.WebviewTag | null;
  setWebview: (webview: Electron.WebviewTag | null) => void;

  baekjoonhubExtensionId: string | null;
  setBaekjoonhubExtensionId: (extensionId: string) => void;
};

export const createBojViewSlice: StateCreator<BojViewSlice> = (set): BojViewSlice => ({
  webview: null,
  setWebview(webview) {
    set(() => ({ webview }));
  },

  isResizerDrag: false,
  setIsDrag(isDrag) {
    set(() => ({
      isResizerDrag: isDrag,
    }));
  },

  webviewUrl: WEBVIEW_HOME_URL,
  setWebViewUrl(url) {
    set(() => ({ webviewUrl: url }));
  },

  baekjoonhubExtensionId: null,
  setBaekjoonhubExtensionId(extensionId) {
    set(() => ({ baekjoonhubExtensionId: extensionId }));
  },
});
