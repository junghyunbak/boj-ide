import { type StateCreator } from 'zustand';

import { BOJ_PROBLEM_1000, WEBVIEW_HOME_URL } from '@/renderer/constants';

// TODO: BojView -> webview
type BojViewSlice = {
  webview: Electron.WebviewTag | null;
  setWebview(webview: Electron.WebviewTag | null): void;

  webviewUrl: string;
  setWebViewUrl(url: string): void;

  webviewIsLoading: boolean;
  setWebviewIsLoading: (webviewIsLoading: boolean) => void;

  insertCSSKey: string | null;

  isResizerDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;

  baekjoonhubExtensionId: string | null;
  setBaekjoonhubExtensionId: (extensionId: string) => void;
};

export const createBojViewSlice: StateCreator<BojViewSlice> = (set): BojViewSlice => ({
  webview: null,
  setWebview(webview) {
    set(() => ({ webview }));
  },

  webviewUrl: BOJ_PROBLEM_1000,
  setWebViewUrl(url) {
    set(() => ({ webviewUrl: url }));
  },

  webviewIsLoading: true,
  setWebviewIsLoading(webviewIsLoading) {
    set(() => ({ webviewIsLoading }));
  },

  insertCSSKey: null,

  isResizerDrag: false,
  setIsDrag(isDrag) {
    set(() => ({
      isResizerDrag: isDrag,
    }));
  },

  baekjoonhubExtensionId: null,
  setBaekjoonhubExtensionId(extensionId) {
    set(() => ({ baekjoonhubExtensionId: extensionId }));
  },
});
