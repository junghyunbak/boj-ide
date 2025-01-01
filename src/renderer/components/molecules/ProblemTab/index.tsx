import { useFetchProblem, useProblem, useTab, useWebview } from '@/renderer/hooks';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TabButton } from '@/renderer/components/atoms/buttons/TabButton';
import { css } from '@emotion/react';
import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { BOJ_DOMAIN } from '@/constants';
import { useEffect, useRef } from 'react';

interface ProblemTabProps {
  problemInfo: ProblemInfo;
  tabIndex: number;
}

export function ProblemTab({ problemInfo, tabIndex }: ProblemTabProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem, gotoUrl } = useWebview();
  const { TierImg } = useFetchProblem(problemInfo.number);

  const ref = useRef<HTMLButtonElement>(null);

  const isSelect = problem?.number === problemInfo.number;

  useEffect(() => {
    if (isSelect && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [isSelect]);

  const handleTabClick = () => {
    gotoProblem(problemInfo);
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  };

  const handleTabCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const nextProblem = removeTab(tabIndex);

    if (!nextProblem) {
      gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
    } else {
      gotoProblem(nextProblem);
    }

    e.stopPropagation();
  };

  return (
    <TabButton onClick={handleTabClick} isSelect={isSelect} ref={ref}>
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

        <XButton onClick={handleTabCloseButtonClick} />
      </div>
    </TabButton>
  );
}
