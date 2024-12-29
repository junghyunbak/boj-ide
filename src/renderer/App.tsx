import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { BOJ_DOMAIN } from '@/constants';
import { MainPage } from '@/renderer/components/pages/MainPage';
import { useWebviewRoute } from '@/renderer/hooks';
import './App.css';
import './assets/fonts/fonts.css';

export default function App() {
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setIsJudging] = useStore(useShallow((s) => [s.setIsJudging]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const { gotoUrl } = useWebviewRoute();

  useEffect(() => {
    window.electron.ipcRenderer.on('judge-reset', () => {
      setIsJudging(false);
      setJudgeResult(() => []);
    });

    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      setMessage(message);
    });

    window.electron.ipcRenderer.on('open-problem', ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    });

    window.electron.ipcRenderer.sendMessage('open-deep-link');
  }, [setJudgeResult, setIsJudging, setMessage, gotoUrl]);

  return <MainPage />;
}
