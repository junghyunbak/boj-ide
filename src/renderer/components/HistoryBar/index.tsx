import { useEffect, useRef } from 'react';

import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/css';

import { useStore } from '../../store';

export function HistoryBar() {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));

  const [problemHistories, removeProblemHistory] = useStore(
    useShallow((s) => [s.problemHistories, s.removeProblemHistory]),
  );

  const xScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const xScroll = xScrollRef.current;

    if (!xScroll) {
      return () => {};
    }

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;

      startX = e.clientX;

      scrollLeft = xScroll.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaX = e.clientX - startX;

      xScroll.scrollLeft = scrollLeft - deltaX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    xScroll.addEventListener('mousedown', handleMouseDown);
    xScroll.addEventListener('mousemove', handleMouseMove);
    xScroll.addEventListener('mouseup', handleMouseUp);
    xScroll.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      xScroll.removeEventListener('mousedown', handleMouseDown);
      xScroll.removeEventListener('mousemove', handleMouseMove);
      xScroll.removeEventListener('mouseup', handleMouseUp);
      xScroll.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={css`
        border-bottom: 1px solid lightgray;
        display: flex;
        overflow-x: scroll;
        min-height: 40px;
        height: 40px;

        &::-webkit-scrollbar {
          display: none;
        }
      `}
      ref={xScrollRef}
    >
      {problemHistories.map((problemInfo, i) => {
        const { number, name } = problemInfo;

        return (
          <button
            type="button"
            key={number}
            className={css`
              border-right: 1px solid lightgray;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 0.5rem;
              gap: 0.5rem;
              background-color: ${problem?.number === number ? 'gray' : 'transparent'};
              cursor: pointer;
              border: none;
            `}
            onClick={() => {
              setProblem(problemInfo);
              window.electron.ipcRenderer.sendMessage('go-problem', { data: problemInfo });
            }}
          >
            <p
              className={css`
                margin: 0;
                white-space: nowrap;
              `}
            >
              {`${number}번: ${name}`}
            </p>
            <button
              type="button"
              onClick={() => {
                removeProblemHistory(i);
              }}
            >
              x
            </button>
          </button>
        );
      })}
    </div>
  );
}
