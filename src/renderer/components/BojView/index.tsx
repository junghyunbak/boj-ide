import { css } from '@emotion/css';
import { useEffect, useRef } from 'react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { BrowserNavigation } from '../BrowserNavigation';

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
  const [url] = useStore(useShallow((s) => [s.url]));
  const [isDrag] = useStore(useShallow((s) => [s.isDrag]));

  const bojAreaRef = useRef<HTMLDivElement>(null);

  /**
   * bojView 영역 변경에 따른 electron으로 동기화 요청
   */
  useEffect(() => {
    useStore.subscribe((s, prev) => {
      if (s.leftRatio !== prev.leftRatio) {
        sendResizingResult(bojAreaRef.current);
      }
    });

    const handleResizedBojView = () => {
      sendResizingResult(bojAreaRef.current);
    };

    window.addEventListener('resize', handleResizedBojView);

    handleResizedBojView();

    return () => {
      window.removeEventListener('resize', handleResizedBojView);
    };
  }, []);

  /**
   * electron에서 bojView 영역 크기 요청 이벤트 리스너
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('call-boj-view-rect', () => {
      sendResizingResult(bojAreaRef.current);
    });
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
          display: flex;
        `}
        ref={bojAreaRef}
      >
        <webview
          className={css`
            flex: 1;
            pointer-events: ${isDrag ? 'none' : 'auto'};
          `}
          src={url}
        />
      </div>
    </div>
  );
}
