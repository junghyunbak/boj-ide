import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useWebview() {
  const [webview] = useStore(useShallow((s) => [s.webview]));
  const [webviewUrl] = useStore(useShallow((s) => [s.webviewUrl]));
  const [webviewIsLoading] = useStore(useShallow((s) => [s.webviewIsLoading]));

  return {
    webview,
    webviewUrl,
    webviewIsLoading,
  };
}
