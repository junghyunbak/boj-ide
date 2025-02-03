import { useMemo } from 'react';

import { css } from '@emotion/react';

import { BookmarkTab } from '@/renderer/components/molecules/BookmarkTab';
import { ProblemTab } from '@/renderer/components/molecules/ProblemTab';
import { MovableTab } from '@/renderer/components/molecules/MovableTab';
import { TabOptions } from '@/renderer/components/molecules/TabOptions';

import { useTab } from '@/renderer/hooks';

import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/common/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

import './index.css';

export function Tabs() {
  const { tabs } = useTab();

  const [baekjoonhubExtensionId] = useStore(useShallow((s) => [s.baekjoonhubExtensionId]));

  const bookmarks: BookmarkInfo[] = useMemo(() => {
    const ret: BookmarkInfo[] = [
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

    if (baekjoonhubExtensionId) {
      ret.push({
        url: `chrome-extension://${baekjoonhubExtensionId}`,
        title: '백준 허브',
        path: '/popup.html',
      });
    }

    return ret;
  }, [baekjoonhubExtensionId]);

  return (
    <div
      css={css`
        width: 100%;
        background-color: #f9f9f9;
        border-bottom: 1px solid lightgray;
      `}
    >
      <div
        css={css`
          width: 100%;
          padding-top: 0.25rem;
          margin-bottom: -1px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div
          css={css`
            flex: 1;
            overflow: hidden;
          `}
        >
          <OverlayScrollbarsComponent
            options={{
              scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 200,
                theme: 'os-theme-dark os-theme-custom',
              },
            }}
          >
            <div
              css={css`
                display: flex;
              `}
            >
              {bookmarks.map((bookmarkInfo) => {
                return <BookmarkTab key={bookmarkInfo.url} bookmarkInfo={bookmarkInfo} />;
              })}

              {tabs.map((problemInfo, index) => (
                <ProblemTab key={problemInfo.number} problemInfo={problemInfo} tabIndex={index} />
              ))}

              <div
                css={css`
                  flex: 1;
                `}
              >
                <MovableTab tabIndex={tabs.length} polyfill />
              </div>
            </div>
          </OverlayScrollbarsComponent>
        </div>

        <TabOptions />
      </div>
    </div>
  );
}
