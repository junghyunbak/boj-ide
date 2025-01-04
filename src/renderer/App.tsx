import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { MainPage } from '@/renderer/components/pages/MainPage';

import { useWebview, useAlertModalController } from '@/renderer/hooks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './App.css';
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
  const { fireAlertModal } = useAlertModalController();
  const { gotoUrl } = useWebview();

  useEffect(() => {
    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      fireAlertModal('에러 발생', message);
    });

    window.electron.ipcRenderer.on('open-problem', ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    });

    window.electron.ipcRenderer.sendMessage('open-deep-link');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('occur-error');
      window.electron.ipcRenderer.removeAllListeners('open-problem');
    };
  }, [fireAlertModal, gotoUrl]);

  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
