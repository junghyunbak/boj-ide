import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useXScroll } from '@/renderer/hooks';
import { css } from '@emotion/react';
import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/constants';

import {
  HistoryBarItemLayout,
  HistoryBarItemContentBox,
  HistoryBarItemContentParagraph,
  HistoryBarLayout,
  HistoryBarItemDecoratorBox,
} from './index.styles';
import { HistoryBarItem } from './HistoryBarItem';

export function HistoryBar() {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));
  const [webViewUrl, setWebViewUrl] = useStore(useShallow((s) => [s.url, s.setUrl]));

  const [problemHistories] = useStore(useShallow((s) => [s.problemHistories, s.removeProblemHistory]));

  const { xScrollRef } = useXScroll();

  const handleBookmarkItemClick = (url: string) => () => {
    setProblem(null);
    setWebViewUrl(url);
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
        return <HistoryBarItem problemInfo={problemInfo} index={index} key={problemInfo.number} />;
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
