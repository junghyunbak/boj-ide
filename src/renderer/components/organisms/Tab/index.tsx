import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useXScroll } from '@/renderer/hooks';
import { css } from '@emotion/react';
import { BookmarkTab } from '@/renderer/components/molecules/BookmarkTab';
import { ProblemTab } from '@/renderer/components/molecules/ProblemTab';

const bookmarks: BookmarkInfo[] = [
  {
    url: 'https://www.acmicpc.net',
    title: 'baekjoon',
    path: '/problemset',
  },
  {
    url: 'https://solved.ac',
    title: 'solved.ac',
  },
];

export function Tab() {
  const [problemHistories] = useStore(useShallow((s) => [s.problemHistories, s.removeProblemHistory]));

  const { xScrollRef } = useXScroll();

  return (
    <div
      ref={xScrollRef}
      css={css`
        display: flex;
        overflow-x: scroll;
        background-color: #f9f9f9;
        padding-top: 0.25rem;

        &::-webkit-scrollbar {
          display: none;
        }
      `}
    >
      {bookmarks.map((bookmarkInfo) => {
        return <BookmarkTab bookmarkInfo={bookmarkInfo} />;
      })}

      {problemHistories.map((problemInfo, index) => (
        <ProblemTab key={problemInfo.number} problemInfo={problemInfo} tabIndex={index} />
      ))}

      <div
        css={css`
          flex: 1;
          border-bottom: 1px solid lightgray;
        `}
      />
    </div>
  );
}
