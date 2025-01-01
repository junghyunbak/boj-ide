import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { BOJ_DOMAIN } from '@/constants';
import { MainPage } from '@/renderer/components/pages/MainPage';
import { useWebview } from '@/renderer/hooks';
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
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const { gotoUrl } = useWebview();

  useEffect(() => {
    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      setMessage(message);
    });

    window.electron.ipcRenderer.on('open-problem', ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    });

    window.electron.ipcRenderer.sendMessage('open-deep-link');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('occur-error');
      window.electron.ipcRenderer.removeAllListeners('open-problem');
    };
  }, [setMessage, gotoUrl]);

  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
