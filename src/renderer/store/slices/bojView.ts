import { type StateCreator } from 'zustand';

import { BOJ_PROBLEM_1000 } from '@/renderer/constants';

// TODO: BojView -> webview
type BojViewSlice = {
  webview: Electron.WebviewTag | null;
  setWebview(webview: Electron.WebviewTag | null): void;

  webviewUrl: string;
  setWebViewUrl(url: string): void;

  webviewIsLoading: boolean;
  setWebviewIsLoading(webviewIsLoading: boolean): void;

  canGoBack: boolean;
  setCanGoBack(canGoBack: boolean): void;

  canGoForward: boolean;
  setCanGoForward(canGoForward: boolean): void;

  insertCSSKey: string | null;

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

  canGoBack: false,
  setCanGoBack(canGoBack) {
    set(() => ({ canGoBack }));
  },

  canGoForward: false,
  setCanGoForward(canGoForward) {
    set(() => ({ canGoForward }));
  },

  insertCSSKey: null,

  baekjoonhubExtensionId: null,
  setBaekjoonhubExtensionId(extensionId) {
    set(() => ({ baekjoonhubExtensionId: extensionId }));
  },
});
