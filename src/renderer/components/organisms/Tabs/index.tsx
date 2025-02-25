import { useEffect } from 'react';

import { css } from '@emotion/react';

import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/common/constants';

import { TabOptions } from '@/renderer/components/molecules/TabOptions';
import { TabProblem } from '@/renderer/components/molecules/TabProblem';
import { TabBookmark } from '@/renderer/components/molecules/TabBookmark';
import { TabExtension } from '@/renderer/components/molecules/TabExtension';
import { TabPolyfill } from '@/renderer/components/molecules/TabPolyfill';

import { useTab } from '@/renderer/hooks';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { baekjoonhubLogo, baekjoonLogo, solvedACLogo } from '@/renderer/assets/base64Images';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

import './index.css';

export function Tabs() {
  const { tabs, addBookmarkTab, addExtensionTab } = useTab();

  const [baekjoonhubExtensionId] = useStore(useShallow((s) => [s.baekjoonhubExtensionId]));

  /**
   * 탭을 동적으로 추가하는 이유는, 기존 사용자들은 persist 상태를 동기화하기 때문에
   * 탭 기본 값에 default 북마크 데이터를 추가한다고 해도 반영되지 않기 때문.
   *
   * persist와 동기화 된 전역 상태의 데이터를, 다른 이름의 전역 상태로 문제없이 마이그레이션 할 수 있는 방법을 찾기 전까진,
   * 중복된 데이터를 거를 수 있는 addTab 메서드를 이용하여 렌더링마다 동적으로 추가하도록 함.
   */
  useEffect(() => {
    const bookmarks: BookmarkInfo[] = [
      {
        url: `https://${BOJ_DOMAIN}`,
        title: '백준',
        path: '/search',
        logoImgBase64: baekjoonLogo,
      },
      {
        url: `https://${SOLVED_AC_DOMAIN}`,
        title: 'solved.ac',
        logoImgBase64: solvedACLogo,
      },
    ];

    bookmarks.forEach((bookmark) => {
      addBookmarkTab(bookmark);
    });
  }, [addBookmarkTab]);

  useEffect(() => {
    if (typeof baekjoonhubExtensionId !== 'string') {
      return;
    }

    addExtensionTab({
      type: 'baekjoonhub',
      id: baekjoonhubExtensionId,
      title: '백준 허브',
      path: '/popup.html',
      logoImgBase64: baekjoonhubLogo,
    });
  }, [baekjoonhubExtensionId, addExtensionTab]);

  return (
    <div
      css={css`
        width: 100%;
        background-color: #f9f9f9;
      `}
    >
      <div
        css={css`
          width: 100%;
          padding-top: 0.3rem;

          display: flex;
          justify-content: space-between;
          align-items: center;

          border-bottom: 1px solid lightgray;
        `}
      >
        <div
          css={css`
            flex: 1;
            overflow: hidden;
            //margin-bottom: -1px;
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
              {tabs
                .filter((tab) => tab)
                .map((tab, index) => {
                  if (isProblemTab(tab)) {
                    return <TabProblem index={index} tab={tab} key={tab.number} />;
                  }

                  if (isBookmarkTab(tab)) {
                    return <TabBookmark index={index} tab={tab} key={tab.url} />;
                  }

                  return <TabExtension index={index} tab={tab} key={tab.id} />;
                })}

              <TabPolyfill />
            </div>
          </OverlayScrollbarsComponent>
        </div>

        <TabOptions />
      </div>
    </div>
  );
}
