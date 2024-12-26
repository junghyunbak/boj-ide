/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MouseEventHandler } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useXScroll } from '@/renderer/hooks';
import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { css } from '@emotion/react';
import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/constants';

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
  const [webViewUrl, setWebViewUrl] = useStore(useShallow((s) => [s.url, s.setUrl]));

  const [problemHistories, removeProblemHistory] = useStore(
    useShallow((s) => [s.problemHistories, s.removeProblemHistory]),
  );

  const { xScrollRef } = useXScroll();

  const handleHistoryBarItemClick = (problemInfo: ProblemInfo) => () => {
    setProblem(problemInfo);
    setWebViewUrl(`https://${BOJ_DOMAIN}/problem/${problemInfo.number}`);
  };

  const handleBookmarkItemClick = (url: string) => () => {
    setProblem(null);
    setWebViewUrl(url);
  };

  const handleHistoryBarItemCloseButtonClick =
    (problemInfo: ProblemInfo, index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      const nextProblem = removeProblemHistory(index);

      if (!nextProblem) {
        setProblem(null);
        setWebViewUrl(`https://${BOJ_DOMAIN}/problemset`);
      } else if (nextProblem && problem?.number === problemInfo.number) {
        setProblem(nextProblem);
        setWebViewUrl(`https://${BOJ_DOMAIN}/problem/${nextProblem.number}`);
      }

      e.stopPropagation();
    };

  return (
    <HistoryBarLayout ref={xScrollRef}>
      {[
        [`https://${SOLVED_AC_DOMAIN}`, 'solved.ac'],
        // [ ]: /problemset 경로로 변경
        [`https://${BOJ_DOMAIN}`, 'baekjoon'],
      ].map(([url, title]) => {
        const isSelect = (() => {
          if (problem) {
            return false;
          }

          if (webViewUrl.startsWith(url)) {
            return true;
          }

          return false;
        })();

        return (
          <HistoryBarItemLayout key={url} onClick={handleBookmarkItemClick(url)}>
            {isSelect && <HistoryBarItemDecoratorBox direction="left" />}
            <HistoryBarItemContentBox isSelect={isSelect}>
              <HistoryBarItemContentParagraph>{title}</HistoryBarItemContentParagraph>
            </HistoryBarItemContentBox>
            {isSelect && <HistoryBarItemDecoratorBox direction="right" />}
          </HistoryBarItemLayout>
        );
      })}

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
