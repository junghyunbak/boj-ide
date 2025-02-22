import { css } from '@emotion/react';

import { useFetchProblem, useProblem, useTab, useWebviewController } from '@/renderer/hooks';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { MovableTab } from '@/renderer/components/molecules/MovableTab';

interface ProblemTabProps {
  tab: ProblemInfo;
  index: number;
}

export function ProblemTab({ tab, index }: ProblemTabProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem } = useWebviewController();
  const { TierImg } = useFetchProblem(tab.number);

  const isSelect = problem?.number === tab.number;

  const handleTabCloseButtonClick = () => {
    removeTab(index, isSelect);
  };

  const handleTabClick = () => {
    gotoProblem(tab);
  };

  return (
    <MovableTab
      callbackTabButtonClick={handleTabClick}
      callbackTabCloseButtonClick={handleTabCloseButtonClick}
      isTabSelect={isSelect}
      tabIndex={index}
    >
      <div
        css={css`
          display: flex;
          width: 0.75rem;
          flex-shrink: 0;
        `}
      >
        {TierImg}
      </div>

      <Text whiteSpace="nowrap" userSelect="none">{`${tab.number}번: ${tab.name}`}</Text>
    </MovableTab>
  );
}
