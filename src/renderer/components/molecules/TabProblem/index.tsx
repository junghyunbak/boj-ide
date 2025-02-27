import { css } from '@emotion/react';

import { useFetchProblem, useProblem, useTab, useWebviewController } from '@/renderer/hooks';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { MovableTab } from '@/renderer/components/molecules/MovableTab';

interface TabProblemProps {
  tab: ProblemInfo;
  index: number;
}

export function TabProblem({ tab, index }: TabProblemProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem } = useWebviewController();
  const { tierBase64 } = useFetchProblem(tab.number);

  const isSelect = problem?.number === tab.number;

  const handleTabCloseButtonClick = () => {
    removeTab(index, isSelect);
  };

  const handleTabClick = () => {
    gotoProblem(tab);
  };

  return (
    <MovableTab isSelect={isSelect} tabIndex={index} onClick={handleTabClick}>
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabLeftBorder />
      <MovableTab.MovableTabRightBorder />

      <MovableTab.MovableTabLeftLine />

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          <div
            css={css`
              display: flex;
              width: 0.75rem;
              flex-shrink: 0;
            `}
          >
            {tierBase64 && (
              <img
                src={tierBase64}
                alt=""
                css={css`
                  width: 100%;
                  height: 100%;
                  user-select: none;
                `}
                draggable={false}
              />
            )}
          </div>

          <p
            css={css`
              white-space: nowrap;
              user-select: none;
            `}
          >{`${tab.number}번: ${tab.name}`}</p>
        </MovableTab.MovableTabContent.MovableTabContentDetail>
        <MovableTab.MovableTabContent.MovableTabContentCloseButton onClick={handleTabCloseButtonClick} />
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
