/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MouseEventHandler } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useXScroll } from '@/renderer/hooks';
import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { css } from '@emotion/react';

import {
  HistoryBarItemLayout,
  HistoryBarItemCloseButton,
  HistoryBarItemContentBox,
  HistoryBarItemContentParagraph,
  HistoryBarLayout,
  HistoryBarItemDecoratorBox,
} from './index.styles';

export function HistoryBar() {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));

  const [problemHistories, removeProblemHistory] = useStore(
    useShallow((s) => [s.problemHistories, s.removeProblemHistory]),
  );

  const { xScrollRef } = useXScroll();

  const handleHistoryBarItemClick = (problemInfo: ProblemInfo) => () => {
    setProblem(problemInfo);
    window.electron.ipcRenderer.sendMessage('go-problem', { data: problemInfo });
  };

  const handleHistoryBarItemCloseButtonClick =
    (problemInfo: ProblemInfo, index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const nextProblem = removeProblemHistory(index);

      if (problem?.number === problemInfo.number) {
        setProblem(nextProblem);
        window.electron.ipcRenderer.sendMessage('go-problem', { data: nextProblem });
      }

      e.stopPropagation();
    };

  return (
    <HistoryBarLayout ref={xScrollRef}>
      {problemHistories.map((problemInfo, index) => {
        const isSelect = problem?.number === problemInfo.number;

        return (
          <HistoryBarItemLayout key={problemInfo.number} onClick={handleHistoryBarItemClick(problemInfo)}>
            {isSelect && <HistoryBarItemDecoratorBox direction="left" />}
            <HistoryBarItemContentBox isSelect={isSelect}>
              <HistoryBarItemContentParagraph>
                {`${problemInfo.number}번: ${problemInfo.name}`}
              </HistoryBarItemContentParagraph>

              <HistoryBarItemCloseButton
                type="button"
                aria-label="tab-close-button"
                onClick={handleHistoryBarItemCloseButtonClick(problemInfo, index)}
              >
                <X />
              </HistoryBarItemCloseButton>
            </HistoryBarItemContentBox>
            {isSelect && <HistoryBarItemDecoratorBox direction="right" />}
          </HistoryBarItemLayout>
        );
      })}

      <div
        css={css`
          flex: 1;
          border-bottom: 1px solid lightgray;
        `}
      />
    </HistoryBarLayout>
  );
}
