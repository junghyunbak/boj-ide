import { css } from '@emotion/css';
import { useEffect, useRef } from 'react';
import { BrowserNavigation } from '../BrowserNavigation';

import { useStore } from '../../store';

const sendResizingResult = (htmlDivEl: HTMLDivElement | null) => {
  if (!htmlDivEl) {
    return;
  }

  const { x, y, width, height } = htmlDivEl.getBoundingClientRect();

  window.electron.ipcRenderer.sendMessage('change-boj-view-width', {
    data: { x, y, width, height },
  });
};

export function BojView() {
  const bojAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useStore.subscribe((s, prev) => {
      if (s.leftRatio !== prev.leftRatio) {
        sendResizingResult(bojAreaRef.current);
      }
    });

    window.addEventListener('resize', () => {
      sendResizingResult(bojAreaRef.current);
    });

    sendResizingResult(bojAreaRef.current);
  }, []);

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <BrowserNavigation />

      <div
        className={css`
          flex: 1;
          padding: 10%;
        `}
        ref={bojAreaRef}
      >
        <div
          className={css`
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 4px dotted lightgray;
            border-radius: 10px;
          `}
        >
          <p
            className={css`
              color: gray;
            `}
          >
            로딩 중...
          </p>
        </div>
      </div>
    </div>
  );
}
