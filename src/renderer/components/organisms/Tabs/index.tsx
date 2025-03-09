import { useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import { BOJ_DOMAIN, SOLVED_AC_DOMAIN } from '@/common/constants';

import { TabOptions } from '@/renderer/components/molecules/TabOptions';
import { TabProblem } from '@/renderer/components/molecules/TabProblem';
import { TabBookmark } from '@/renderer/components/molecules/TabBookmark';
import { TabExtension } from '@/renderer/components/molecules/TabExtension';
import { TabPolyfill } from '@/renderer/components/molecules/TabPolyfill';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import {
  useTab,
  useIpcEvent,
  useProblem,
  useConfirmModalController,
  useDailyProblem,
  useLoadDailyProblems,
} from '@/renderer/hooks';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { baekjoonhubLogo, baekjoonLogo, solvedACLogo } from '@/renderer/assets/base64Images';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

import { TabProblemGhost } from '../../molecules/TabProblemGhost';

export function Tabs() {
  useLoadDailyProblems();

  const { tabs, addBookmarkTab, addExtensionTab, getProblemTabCount } = useTab();
  const { problem } = useProblem();
  const { fireConfirmModal } = useConfirmModalController();
  const { dailyProblemNumbers, activeDailyProblem } = useDailyProblem();

  // TODO: 훅으로 분리
  const [baekjoonhubExtensionId] = useStore(useShallow((s) => [s.baekjoonhubExtensionId]));

  const tourRef = useRef<HTMLDivElement>(null);

  useIpcEvent(
    () => {
      if (getProblemTabCount() === 0 || !problem) {
        fireConfirmModal('종료하시겠습니까?', () => {
          window.electron.ipcRenderer.sendMessage('quit-app');
        });
      }
    },
    [getProblemTabCount, problem, fireConfirmModal],
    'close-tab',
  );

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
      css={(theme) => css`
        width: 100%;
        background-color: ${theme.colors.tabBg};

        .os-theme-custom {
          --os-handle-interactive-area-offset: 0;
          --os-handle-bg: ${theme.colors.scrollbar};
          --os-handle-bg-hover: ${theme.colors.scrollbarHover};
          --os-handle-bg-active: ${theme.colors.scrollbarActive};
          --os-handle-border-radius: 0;
          --os-padding-axis: 0;
          --os-padding-perpendicular: 0;
          --os-size: 4px;
        }
      `}
      ref={tourRef}
    >
      <div
        css={css`
          width: 100%;
          padding-top: 0.3rem;

          display: flex;
          justify-content: space-between;
          align-items: end;
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

              {activeDailyProblem &&
                dailyProblemNumbers.map((problemNumber) => {
                  return <TabProblemGhost num={problemNumber} key={problemNumber} />;
                })}

              <TabPolyfill />
            </div>
          </OverlayScrollbarsComponent>
        </div>

        <TabOptions />
      </div>

      <TourOverlay title="탭" tourRef={tourRef} guideLoc="bottom" myTourStep={6}>
        <p>문제 페이지로 이동할 때 마다 탭이 생성됩니다.</p>
        <br />
        <ul>
          <li>탭을 클릭하여 문제 혹은 페이지로 이동할 수 있습니다.</li>
          <li>
            탭을 <b>드래그</b>하여 순서를 변경할 수 있습니다.
          </li>
          <li>
            활성화 된 탭은 <code>⌘/⌃ + w</code> 단축키로 닫을 수 있습니다.
          </li>
          <li>
            우측 <code>...</code> 버튼에서 한번에 모든 문제 탭을 닫을 수 있습니다.
          </li>
        </ul>
        <br />
        <h5>* 고정 북마크와 확장 프로그램 탭은 닫을 수 없습니다.</h5>
      </TourOverlay>
    </div>
  );
}
