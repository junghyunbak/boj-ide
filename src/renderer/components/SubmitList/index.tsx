import { useEffect } from 'react';
import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { useShallow } from 'zustand/shallow';
import { useSubmitList } from '@/renderer/hooks';
import { SubmitListItem } from './SubmitListItem';

export function SubmitList() {
  const [submitState, setSubmitState] = useStore(useShallow((s) => [s.submitState, s.setSubmitState]));
  const { closeSumbitList } = useSubmitList();

  useEffect(() => {
    window.electron.ipcRenderer.on('submit-code-result', ({ data: { id, gage, type, resultText } }) => {
      setSubmitState((prev) => {
        const next = { ...prev };

        if (!next[id]) {
          return next;
        }

        if (type === 'submit') {
          next[id].gage = gage;
        } else {
          next[id].resultText = resultText || '';
        }

        return next;
      });
    });
  }, [setSubmitState]);

  return (
    <div
      css={css`
        position: absolute;
        inset: 0;
        z-index: 200;
        background: white;
        padding: 1rem;
        overflow-y: scroll;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-bottom: 1rem;
        `}
      >
        <p
          css={css`
            margin: 0;
          `}
        >
          채점 결과
        </p>
        <button
          type="button"
          css={css`
            background: none;
            border: none;
            width: 20px;
            height: 20px;
            padding: 0;
            cursor: pointer;
          `}
          onClick={() => closeSumbitList()}
        >
          <X />
        </button>
      </div>

      <table
        css={css`
          border-collapse: collapse;
          width: 100%;
          color: #333;

          &,
          td,
          th {
            border: 1px solid lightgray;
            padding: 0.5rem;
          }

          th {
            font-size: 0.875rem;
            text-align: start;
          }

          tbody {
            tr {
              &:nth-of-type(2n - 1) {
                background-color: #f9f9f9;
              }
            }
          }
        `}
      >
        <thead>
          <tr>
            <th style={{ width: '40%' }}>문제</th>
            <th style={{ width: '10%' }}>언어</th>
            <th style={{ width: '25%' }}>진행도</th>
            <th style={{ width: '25%' }}>결과</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(Object.entries(submitState))
            .reverse()
            .map(([id, props]) => {
              return <SubmitListItem key={id} {...props} />;
            })}
        </tbody>
      </table>
    </div>
  );
}
