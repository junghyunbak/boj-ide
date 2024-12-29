import { useFetchSolvedACProblemData, useWebviewRoute } from '@/renderer/hooks';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { css } from '@emotion/react';
import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { BOJ_DOMAIN } from '@/constants';

interface ProblemTabProps {
  problemInfo: ProblemInfo;
  tabIndex: number;
}

export function ProblemTab({ problemInfo, tabIndex }: ProblemTabProps) {
  const { TierImg } = useFetchSolvedACProblemData(problemInfo.number);

  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [removeProblemHistory] = useStore(useShallow((s) => [s.removeProblemHistory]));
  const { gotoProblem, gotoUrl } = useWebviewRoute();

  const handleTabClick = () => {
    gotoProblem(problemInfo);
  };

  const handleTabCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const nextProblem = removeProblemHistory(tabIndex);

    if (!nextProblem) {
      gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
    } else if (nextProblem && problem?.number === problemInfo.number) {
      gotoProblem(nextProblem);
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
