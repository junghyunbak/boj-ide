import { useTab } from '@/renderer/hooks';
import { css } from '@emotion/react';
import { BookmarkTab } from '@/renderer/components/molecules/BookmarkTab';
import { ProblemTab } from '@/renderer/components/molecules/ProblemTab';
import { MovableTab } from '@/renderer/components/molecules/MovableTab';
import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/constants';

const bookmarks: BookmarkInfo[] = [
  {
    url: `https://${BOJ_DOMAIN}`,
    title: 'baekjoon',
    path: '/problemset',
  },
  {
    url: `https://${SOLVED_AC_DOMAIN}`,
    title: 'solved.ac',
  },
];

export function Tabs() {
  const { tabs } = useTab();

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        overflow-x: hidden;
        background-color: #f9f9f9;
        padding-top: 0.25rem;
        border-bottom: 1px solid lightgray;
      `}
    >
      {bookmarks.map((bookmarkInfo) => {
        return <BookmarkTab key={bookmarkInfo.url} bookmarkInfo={bookmarkInfo} />;
      })}

      {tabs.map((problemInfo, index) => (
        <MovableTab key={problemInfo.number} index={index}>
          <ProblemTab problemInfo={problemInfo} tabIndex={index} />
        </MovableTab>
      ))}

      <div
        css={css`
          flex: 1;
        `}
      >
        <MovableTab index={tabs.length} polyfill />
      </div>
    </div>
  );
}
