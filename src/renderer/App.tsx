import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/css';

import { useShallow } from 'zustand/shallow';
import { useStore } from './store';

import { Output } from './components/Output';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

import './App.css';
import { AlertModal } from './components/AlertModal';

interface VerticalResizerLayoutProps {
  Up: typeof Editor;
  Down: typeof Output;
}

function VerticalResizerLayout({ Up, Down }: VerticalResizerLayoutProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const upRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);

  const [upRatio, setUpRatio] = useStore(useShallow((s) => [s.upRatio, s.setUpRatio]));

  const [upHeight, setUpHeight] = useState(0);

  useEffect(() => {
    const up = upRef.current;
    const resizer = resizerRef.current;
    const container = containerRef.current;

    if (!up || !resizer || !container) {
      return () => {};
    }

    let isDragging = false;

    let startY = 0;

    let upHeight = 0;

    const handleResizerMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startY = e.clientY;

      upHeight = up.getBoundingClientRect().height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaY = e.clientY - startY;

      const minRatio = 10;

      const ratio = Math.max(minRatio, ((upHeight + deltaY) / container.getBoundingClientRect().height) * 100);

      up.style.height = `${ratio}%`;

      setUpRatio(ratio);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    resizer.addEventListener('mousedown', handleResizerMouseDown);

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      resizer.removeEventListener('mousedown', handleResizerMouseDown);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setUpRatio]);

  /**
   * 윈도우 사이즈가 변경되었을 때, 현재 비율에 맞춰 에디터의 height 픽셀값을 재설정
   *
   * // [ ]: 비율이 변경될 때 마다 이벤트가 재등록/해제 되는 이슈가 있음.
   */
  useEffect(() => {
    const handleResizeUpHeight = () => {
      if (!containerRef.current) {
        return;
      }

      setUpHeight((containerRef.current.getBoundingClientRect().height * upRatio) / 100);
    };

    window.addEventListener('resize', handleResizeUpHeight);

    return () => {
      window.removeEventListener('resize', handleResizeUpHeight);
    };
  }, [upRatio, setUpHeight]);

  /**
   * resizer에 의해 현재 비율이 변경되었을 경우, 에디터의 height 픽셀값을 재설정
   */
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setUpHeight((containerRef.current.getBoundingClientRect().height * upRatio) / 100);
  }, [upRatio]);

  return (
    <div
      ref={containerRef}
      className={css`
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `}
    >
      <div ref={upRef}>
        <Up height={upHeight} />
      </div>

      <div
        className={css`
          height: 15px;
          width: 100%;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
          &:hover {
            cursor: row-resize;
          }
        `}
        ref={resizerRef}
      >
        <div
          className={css`
            border-top: 5px dotted lightgray;
            width: 50px;
          `}
        />
      </div>

      <Down />
    </div>
  );
}

export default function App() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  const [setIsJudging] = useStore(useShallow((s) => [s.setIsJudging]));

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblem(data);
      setJudgeResult(() => []);
    });

    window.electron.ipcRenderer.on('reset-judge', () => {
      setIsJudging(false);
      setJudgeResult(() => []);
    });

    window.electron.ipcRenderer.on('occur-error', ({ data: { message } }) => {
      setMessage(message);
    });

    window.electron.ipcRenderer.sendMessage('ready-editor');
  }, [setProblem, setJudgeResult, setIsJudging, setMessage]);

  useEffect(() => {}, []);

  return (
    <Layout>
      <div
        className={css`
          position: relative;
          width: 100%;
          height: 100%;
        `}
      >
        <div
          className={css`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          <Header />

          <VerticalResizerLayout Up={Editor} Down={Output} />
        </div>

        <AlertModal />
      </div>
    </Layout>
  );
}
