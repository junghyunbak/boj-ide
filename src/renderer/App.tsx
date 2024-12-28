import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';
import { BOJ_DOMAIN } from '@/constants';

import { Output } from '@/renderer/components/templates/Output';
import { Nav } from '@/renderer/components/organisms/Nav';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';
import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';

import { AlertModal } from './components/AlertModal';
import { BojView } from './components/BojView';
import { HistoryBar } from './components/HistoryBar';
import { Footer } from './components/Footer';
import { ConfirmModal } from './components/ConfirmModal';
import { useHorizontalLayout, useWebviewRoute } from './hooks';

import { AppContentBox, AppLayout } from './App.styles';

import './App.css';
import './assets/fonts/fonts.css';
import { Editor } from './components/templates/Editor';
import { RowLine } from './components/atoms/lines/RowLIne';

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

  const { leftRef, containerRef, resizerRef } = useHorizontalLayout({
    onRatioChange: (ratio) => {
      useStore.getState().setLeftRatio(ratio);
    },
  });

  const {
    leftRef: leftRef2,
    containerRef: containerRef2,
    resizerRef: resizerRef2,
  } = useHorizontalLayout({
    onRatioChange: (ratio) => {
      useStore.getState().setTopRatio(ratio);
    },
    reverse: true,
  });

  return (
    <AppLayout>
      <HistoryBar />
      <Nav />
      <RowLine />
      <AppContentBox>
        <div
          ref={containerRef}
          css={css`
            width: 100%;
            height: 100%;
            display: flex;
          `}
        >
          <div
            ref={leftRef}
            css={css`
              width: ${useStore.getState().leftRatio}%;
              height: 100%;
            `}
          >
            <BojView />
          </div>

          <VerticalResizer ref={resizerRef} />

          <div
            css={css`
              flex: 1;
              overflow: hidden;
            `}
          >
            <div
              ref={containerRef2}
              css={css`
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <div
                ref={leftRef2}
                css={css`
                  height: 50%;
                  width: 100%;
                `}
              >
                <Editor />
              </div>

              <HorizontalResizer ref={resizerRef2} />

              <div
                css={css`
                  flex: 1;
                  overflow: hidden;
                `}
              >
                <Output />
              </div>
            </div>
          </div>
        </div>
      </AppContentBox>

      <Footer />

      <AlertModal />
      <ConfirmModal />
    </AppLayout>
  );
}
