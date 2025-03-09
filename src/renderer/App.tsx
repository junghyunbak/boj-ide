import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { MainPage } from '@/renderer/components/pages/MainPage';

import { useAlertModalController, useTheme, useEventFocus, useEventIpc, useModifyWebview } from '@/renderer/hooks';

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
      staleTime: Infinity,
    },
  },
});

export default function App() {
  const { theme } = useTheme();

  const { fireAlertModal } = useAlertModalController();
  const { gotoUrl } = useModifyWebview();

  const [setBaekjoonhubExtensionId] = useStore(useShallow((s) => [s.setBaekjoonhubExtensionId]));

  useEventFocus();

  useEventIpc(
    ({ data: { message } }) => {
      fireAlertModal('에러 발생', message);
    },
    [fireAlertModal],
    'occur-error',
  );

  useEventIpc(
    ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    },
    [gotoUrl],
    'open-problem',
  );

  useEventIpc(
    ({ data: { extensionId } }) => {
      setBaekjoonhubExtensionId(extensionId);
    },
    [setBaekjoonhubExtensionId],
    'set-baekjoonhub-id',
  );

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('open-deep-link');
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
