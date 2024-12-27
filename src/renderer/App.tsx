import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { BOJ_DOMAIN } from '@/constants';

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
import { useWebviewRoute } from './hooks';

import { AppContentBox, EditorAndOutputBox, AppLayout } from './App.styles';

import './App.css';
import './assets/fonts/fonts.css';
import { SubmitList } from './components/SubmitList';

export default function App() {
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [setIsJudging] = useStore(useShallow((s) => [s.setIsJudging]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));
  const [submitListIsOpen] = useStore(useShallow((s) => [s.submitListIsOpen]));

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
      <BrowserNavigation />

      <AppContentBox>
        <HorizontalLayout onLeftRatioChange={handleLeftRatioChange}>
          <HorizontalLayout.Left>
            <div
              css={css`
                width: 100%;
                height: 100%;
                position: relative;
              `}
            >
              <BojView />
              {submitListIsOpen && <SubmitList />}
            </div>
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
