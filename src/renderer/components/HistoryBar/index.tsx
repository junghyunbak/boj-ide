import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/css';

import { useStore } from '../../store';

export function HistoryBar() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [problemHistories, removeProblemHistory] = useStore(
    useShallow((s) => [s.problemHistories, s.removeProblemHistory]),
  );

  return (
    <div
      className={css`
        border-bottom: 1px solid lightgray;
        display: flex;

        height: 40px;
      `}
    >
      {problemHistories.map(({ number, name }, i) => {
        return (
          <div
            key={number}
            className={css`
              border-right: 1px solid lightgray;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 0.5rem;
              gap: 0.5rem;
              background-color: ${problem?.number === number ? 'gray' : 'transparent'};
            `}
          >
            <p
              className={css`
                margin: 0;
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
          </div>
        );
      })}
    </div>
  );
}
