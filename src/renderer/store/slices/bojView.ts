import { BOJ_DOMAIN } from '@/constants';
import { type StateCreator } from 'zustand';

type BojViewSlice = {
  webviewUrl: string;
  setWebViewUrl: (url: string) => void;

  isDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;

  webview: Electron.WebviewTag | null;
  setWebview: (webview: Electron.WebviewTag | null) => void;
};

export const createBojViewSlice: StateCreator<BojViewSlice> = (set): BojViewSlice => ({
  webview: null,
  setWebview(webview) {
    set(() => ({ webview }));
  },
  isDrag: false,
  setIsDrag(isDrag) {
    set(() => ({
      isDrag,
    }));
  },
  webviewUrl: `https://${BOJ_DOMAIN}/problemset`,
  setWebViewUrl(url) {
    set(() => ({ webviewUrl: url }));
  },
});
