import { MainPage } from '@/renderer/components/pages/MainPage';

import { useTheme, useEventFocus, useEventApp, useSetupProblem } from '@/renderer/hooks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

  useSetupProblem();

  useEventFocus();
  useEventApp();

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
