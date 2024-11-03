import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/css';

import { useShallow } from 'zustand/shallow';
import { useStore } from './store';

import { Output } from './components/Output';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

interface VerticalResizerLayoutProps {
  Up: typeof Editor;
  Down: typeof Output;
}

function VerticalResizerLayout({ Up, Down }: VerticalResizerLayoutProps) {
  const upRef = useRef<HTMLDivElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);

  const [height, setHeight] = useState(200);

  useEffect(() => {
    const up = upRef.current;
    const resizer = resizerRef.current;

    if (!up || !resizer) {
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

      setHeight(upHeight + deltaY);
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
  }, [setHeight]);

  return (
    <div>
      <div ref={upRef}>
        <Up height={height} />
      </div>

      <div
        className={css`
          height: 20px;
          width: 100%;
          background: black;
          &:hover {
            cursor: grab;
          }
          &:active {
            cursor: grabbing;
          }
        `}
        ref={resizerRef}
      />

      <Down />
    </div>
  );
}

export default function App() {
  const [setProblem] = useStore(useShallow((s) => [s.setProblem]));

  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  useEffect(() => {
    window.electron.ipcRenderer.on('load-problem-data', ({ data }) => {
      setProblem(data);
      setJudgeResult(() => []);
    });
  }, [setProblem, setJudgeResult]);

  return (
    <Layout>
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
    </Layout>
  );
}
