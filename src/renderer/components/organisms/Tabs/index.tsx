import { useRef } from 'react';

import { css } from '@emotion/react';

import { TabOptions } from '@/renderer/components/molecules/TabOptions';
import { TabProblem } from '@/renderer/components/molecules/TabProblem';
import { TabBookmark } from '@/renderer/components/molecules/TabBookmark';
import { TabExtension } from '@/renderer/components/molecules/TabExtension';
import { TabPolyfill } from '@/renderer/components/molecules/TabPolyfill';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';
import { TabProblemGhost } from '@/renderer/components/molecules/TabProblemGhost';

import { useTab, useDailyProblem, useSetupDailyProblems, useSetupTab, useEventTab } from '@/renderer/hooks';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

export function Tabs() {
  const tourRef = useRef<HTMLDivElement>(null);

  useSetupDailyProblems();
  useSetupTab();

  useEventTab();

  const { tabs } = useTab();
  const { dailyProblemNumbers, activeDailyProblem } = useDailyProblem();

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
          <li>매일 6개의 추천 문제가 점선 탭 형태로 표시됩니다.</li>
          <li>탭 순서를 Drag & Drop 으로 변경 가능합니다.</li>
          <li>
            활성화 탭은 <code>⌘/⌃ + w</code> 단축키로 닫을 수 있습니다.
          </li>
        </ul>
        <br />
        <h5>* 북마크 탭과 확장 프로그램 탭은 닫을 수 없습니다.</h5>
        <h5>* 일일 문제 추천 기능은 탭 우측 메뉴에서 끄고 켤 수 있습니다.</h5>
      </TourOverlay>
    </div>
  );
}
