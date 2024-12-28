import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';
import { BOJ_DOMAIN } from '@/constants';

import { Output } from '@/renderer/components/templates/Output';

import { VerticalLayout } from './components/VerticalLayout';
import { Editor } from './components/Editor';
import { AlertModal } from './components/AlertModal';
import { HorizontalLayout } from './components/HorizontalLayout';
import { BojView } from './components/BojView';
import { HistoryBar } from './components/HistoryBar';
import { Footer } from './components/Footer';
import { ConfirmModal } from './components/ConfirmModal';
import { useWebviewRoute } from './hooks';

import { AppContentBox, EditorAndOutputBox, AppLayout } from './App.styles';

import './App.css';
import './assets/fonts/fonts.css';
import { Nav } from './components/organisms/Nav';
import { EditorHeader } from './components/organisms/EditorHeader';

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

  const handleLeftRatioChange = (leftRatio: number) => {
    useStore.getState().setLeftRatio(leftRatio);
  };

  const handleTopRatioChange = (topRatio: number) => {
    useStore.getState().setTopRatio(topRatio);
  };

  return (
    <AppLayout>
      <HistoryBar />

      <Nav />

      <AppContentBox>
        <HorizontalLayout onLeftRatioChange={handleLeftRatioChange}>
          <HorizontalLayout.Left>
            <BojView />
          </HorizontalLayout.Left>

          <HorizontalLayout.Right>
            <EditorAndOutputBox>
              <EditorHeader />
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
