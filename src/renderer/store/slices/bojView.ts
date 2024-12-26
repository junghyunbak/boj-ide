import { BOJ_DOMAIN } from '@/constants';
import { type StateCreator } from 'zustand';

type BojViewSlice = {
  url: string;
  setUrl: (url: string) => void;

  isDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;

  webView: Electron.WebviewTag | null;
  setWebView: (webView: Electron.WebviewTag | null) => void;
};

export const createBojViewSlice: StateCreator<BojViewSlice> = (set): BojViewSlice => ({
  webView: null,
  setWebView(webView) {
    set(() => ({ webView }));
  },
  isDrag: false,
  setIsDrag(isDrag) {
    set(() => ({
      isDrag,
    }));
  },
  url: `https://${BOJ_DOMAIN}/problemset`,
  setUrl: (url: string) => {
    set(() => ({ url }));
  },
});
