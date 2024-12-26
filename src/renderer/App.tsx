import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';

import { Output } from './components/Output';
import { VerticalLayout } from './components/VerticalLayout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';
import { AlertModal } from './components/AlertModal';
import { HorizontalLayout } from './components/HorizontalLayout';
import { BojView } from './components/BojView';
import { HistoryBar } from './components/HistoryBar';
import { Footer } from './components/Footer';
import { ConfirmModal } from './components/ConfirmModal';
import { BrowserNavigation } from './components/BrowserNavigation';

import { AppContentBox, EditorAndOutputBox, AppLayout } from './App.styles';

import './App.css';
import './assets/fonts/fonts.css';

export default function App() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));
  const [addProblemHistory] = useStore(useShallow((s) => [s.addProblemHistory]));
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setIsJudging] = useStore(useShallow((s) => [s.setIsJudging]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblem(data);
      setJudgeResult(() => []);

      if (data) {
        addProblemHistory(data);
      }
    });

    window.electron.ipcRenderer.on('reset-judge', () => {
      setIsJudging(false);
      setJudgeResult(() => []);
    });

    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      setMessage(message);
    });

    window.electron.ipcRenderer.sendMessage('ready-editor');
  }, [setProblem, setJudgeResult, setIsJudging, setMessage, addProblemHistory]);

  const handleLeftRatioChange = (leftRatio: number) => {
    useStore.getState().setLeftRatio(leftRatio);
  };

  const handleTopRatioChange = (topRatio: number) => {
    useStore.getState().setTopRatio(topRatio);
  };

  return (
    <AppLayout>
      <HistoryBar />
      <BrowserNavigation />

      <AppContentBox>
        <HorizontalLayout onLeftRatioChange={handleLeftRatioChange}>
          <HorizontalLayout.Left>
            <BojView />
          </HorizontalLayout.Left>

          <HorizontalLayout.Right>
            <EditorAndOutputBox>
              <Header />

              <VerticalLayout onTopRatioChange={handleTopRatioChange}>
                <VerticalLayout.Top>
                  <Editor />
                </VerticalLayout.Top>

                <VerticalLayout.Bottom>
                  <Output />
                </VerticalLayout.Bottom>
              </VerticalLayout>
            </EditorAndOutputBox>
          </HorizontalLayout.Right>
        </HorizontalLayout>
      </AppContentBox>

      <Footer />

      <AlertModal />
      <ConfirmModal />
    </AppLayout>
  );
}
