import { useShallow } from 'zustand/shallow';
import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { color, size } from '@/styles';
import { useXScroll } from '@/renderer/hooks';

export function HistoryBar() {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));

  const [problemHistories, removeProblemHistory] = useStore(
    useShallow((s) => [s.problemHistories, s.removeProblemHistory]),
  );

  const { xScrollRef } = useXScroll();

  return (
    <div
      css={css`
        border-bottom: 1px solid lightgray;
        display: flex;
        overflow-x: scroll;
        min-height: ${size.HISTORY_BAR_HEIGHT}px;
        height: ${size.HISTORY_BAR_HEIGHT}px;

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
            css={css`
              background-color: transparent;
              border-top: 0;
              border: 0;
              border-right: 1px solid lightgray;
              padding: 0;
            `}
            onClick={() => {
              setProblem(problemInfo);
              window.electron.ipcRenderer.sendMessage('go-problem', { data: problemInfo });
            }}
          >
            <div
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 0.7rem;
                gap: 0.5rem;
                width: 100%;
                height: 100%;
                border-bottom: 2px solid ${problem?.number === number ? '#428bca' : 'transparent'};
                color: ${color.text};
              `}
            >
              <p
                css={css`
                  margin: 0;
                  white-space: nowrap;
                `}
              >
                {`${number}번: ${name}`}
              </p>
              <button
                type="button"
                css={css`
                  border: none;
                  border-radius: 9999px;
                  width: 15px;
                  height: 15px;
                  background-color: transparent;
                  padding: 1px;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  &:hover {
                    background-color: lightgray;
                    cursor: pointer;
                  }
                `}
                aria-label="tab-close-button"
                onClick={(e) => {
                  removeProblemHistory(i);

                  if (problem?.number === number) {
                    setProblem(null);

                    window.electron.ipcRenderer.sendMessage('go-problem', { data: null });
                  }

                  e.stopPropagation();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  css={css`
                    width: 100%;
                    height: 100%;
                  `}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                    fill="#0F1729"
                  />
                </svg>
              </button>
            </div>
          </button>
        );
      })}
    </div>
  );
}
