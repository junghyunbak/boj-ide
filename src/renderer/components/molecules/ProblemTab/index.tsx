import { css } from '@emotion/react';

import { useFetchProblem, useProblem, useTab, useWebview } from '@/renderer/hooks';

import { BOJ_DOMAIN } from '@/common/constants';

import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { MovableTab } from '@/renderer/components/molecules/MovableTab';

interface ProblemTabProps {
  problemInfo: ProblemInfo;
  tabIndex: number;
}

// [ ]: 닫기 버튼을 누를 때 선택 된 상태가 아니라면, 탭이 삭제된다.
// [ ]: 닫기 버튼을 누를 때 선택라면, 탭이 삭제되고 이전 혹은 이후 탭으로 변경한다.
export function ProblemTab({ problemInfo, tabIndex }: ProblemTabProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem, gotoUrl } = useWebview();
  const { TierImg } = useFetchProblem(problemInfo.number);

  const isSelect = problem?.number === problemInfo.number;

  const handleTabCloseButtonClick = () => {
    const nextProblem = removeTab(tabIndex);

    if (isSelect) {
      if (!nextProblem) {
        gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
      } else {
        gotoProblem(nextProblem);
      }
    }
  };

  const handleTabClick = () => {
    gotoProblem(problemInfo);
  };

  return (
    <MovableTab
      callbackTabButtonClick={handleTabClick}
      callbackTabCloseButtonClick={handleTabCloseButtonClick}
      tabIndex={tabIndex}
      isTabSelect={isSelect}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          align-items: center;
        `}
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

        <Text whiteSpace="nowrap" userSelect="none">{`${problemInfo.number}번: ${problemInfo.name}`}</Text>
      </div>
    </MovableTab>
  );
}
