import { useEffect } from 'react';

import { css } from '@emotion/css';

import { useShallow } from 'zustand/shallow';
import { useStore } from './store';

import { Output } from './components/Output';
import { VerticalLayout } from './components/VerticalLayout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';
import { AlertModal } from './components/AlertModal';
import { HorizontalLayout } from './components/HorizontalLayout';
import { BojView } from './components/BojView';

import './App.css';
import './assets/fonts.css';
import { HistoryBar } from './components/HistoryBar';

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

  return (
    <div
      className={css`
        position: fixed;
        inset: 0;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        `}
      >
        <HistoryBar />

        <div
          className={css`
            flex: 1;
            overflow: hidden;
          `}
        >
          <HorizontalLayout>
            <HorizontalLayout.Left>
              <BojView />
            </HorizontalLayout.Left>

            <HorizontalLayout.Right>
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  position: relative;
                `}
              >
                <Header />

                <VerticalLayout>
                  <VerticalLayout.Top>
                    <Editor />
                  </VerticalLayout.Top>

                  <VerticalLayout.Bottom>
                    <Output />
                  </VerticalLayout.Bottom>
                </VerticalLayout>

                <AlertModal />
              </div>
            </HorizontalLayout.Right>
          </HorizontalLayout>
        </div>
      </div>
    </div>
  );
}
