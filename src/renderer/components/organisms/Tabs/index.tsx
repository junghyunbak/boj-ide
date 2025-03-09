import { useRef } from 'react';

import { css } from '@emotion/react';

import { TabOptions } from '@/renderer/components/molecules/TabOptions';
import { TabProblem } from '@/renderer/components/molecules/TabProblem';
import { TabBookmark } from '@/renderer/components/molecules/TabBookmark';
import { TabExtension } from '@/renderer/components/molecules/TabExtension';
import { TabPolyfill } from '@/renderer/components/molecules/TabPolyfill';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import {
  useTab,
  useEventIpc,
  useProblem,
  useConfirmModalController,
  useDailyProblem,
  useSetupDailyProblems,
  useSetupTab,
} from '@/renderer/hooks';

import { isBookmarkTab, isProblemTab } from '@/renderer/utils/typeGuard';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

import { TabProblemGhost } from '../../molecules/TabProblemGhost';

export function Tabs() {
  useSetupDailyProblems();
  useSetupTab();

  const { tabs, problemTabCount } = useTab();
  const { problem } = useProblem();
  const { fireConfirmModal } = useConfirmModalController();
  const { dailyProblemNumbers, activeDailyProblem } = useDailyProblem();

  const tourRef = useRef<HTMLDivElement>(null);

  useEventIpc(
    () => {
      if (problemTabCount === 0 || !problem) {
        fireConfirmModal('종료하시겠습니까?', () => {
          window.electron.ipcRenderer.sendMessage('quit-app');
        });
      }
    },
    [problemTabCount, problem, fireConfirmModal],
    'close-tab',
  );

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
