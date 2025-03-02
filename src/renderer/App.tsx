import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { MainPage } from '@/renderer/components/pages/MainPage';

import { useAlertModalController, useWebviewController, useTheme, useFocusRecovery } from '@/renderer/hooks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { Global, ThemeProvider } from '@emotion/react';

import { themes, globalStyle } from '@/renderer/styles';

import './assets/fonts/fonts.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const { theme } = useTheme();

  const { fireAlertModal } = useAlertModalController();
  const { gotoUrl } = useWebviewController();

  const [setBaekjoonhubExtensionId] = useStore(useShallow((s) => [s.setBaekjoonhubExtensionId]));

  useFocusRecovery();

  useEffect(() => {
    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      fireAlertModal('에러 발생', message);
    });

    window.electron.ipcRenderer.on('open-problem', ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    });

    window.electron.ipcRenderer.on('set-baekjoonhub-id', ({ data: { extensionId } }) => {
      setBaekjoonhubExtensionId(extensionId);
    });

    window.electron.ipcRenderer.sendMessage('open-deep-link');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('occur-error');
      window.electron.ipcRenderer.removeAllListeners('open-problem');
      window.electron.ipcRenderer.removeAllListeners('set-baekjoonhub-id');
    };
  }, [fireAlertModal, gotoUrl, setBaekjoonhubExtensionId]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <Global styles={globalStyle} />
      <QueryClientProvider client={queryClient}>
        <MainPage />

        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
