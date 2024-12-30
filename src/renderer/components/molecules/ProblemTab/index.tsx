import { useFetchSolvedACProblemData, useProblem, useTab, useWebview } from '@/renderer/hooks';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { css } from '@emotion/react';
import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { BOJ_DOMAIN } from '@/constants';

interface ProblemTabProps {
  problemInfo: ProblemInfo;
  tabIndex: number;
}

export function ProblemTab({ problemInfo, tabIndex }: ProblemTabProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem, gotoUrl } = useWebview();
  const { TierImg } = useFetchSolvedACProblemData(problemInfo.number);

  const handleTabClick = () => {
    gotoProblem(problemInfo);
  };

  const handleTabCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const problem = removeTab(tabIndex);

    if (!problem) {
      gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
    } else {
      gotoProblem(problem);
    }

    e.stopPropagation();
  };

  const isSelect = problem?.number === problemInfo.number;

  return (
    <TabButton onClick={handleTabClick} isSelect={isSelect}>
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

        <Text whiteSpace="nowrap">{`${problemInfo.number}번: ${problemInfo.name}`}</Text>

        <XButton onClick={handleTabCloseButtonClick} />
      </div>
    </TabButton>
  );
}
