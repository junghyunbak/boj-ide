import { css } from '@emotion/react';
import { MouseEventHandler, useEffect, useState } from 'react';
import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { BOJ_DOMAIN } from '@/constants';
import {
  HistoryBarItemLayout,
  HistoryBarItemCloseButton,
  HistoryBarItemContentBox,
  HistoryBarItemContentParagraph,
  HistoryBarItemDecoratorBox,
} from '../index.styles';

interface HistoryBarItemProps {
  problemInfo: ProblemInfo;
  index: number;
}

export function HistoryBarItem({ problemInfo, index }: HistoryBarItemProps) {
  const [problem, setProblem] = useStore(useShallow((s) => [s.problem, s.setProblem]));
  const [setWebViewUrl] = useStore(useShallow((s) => [s.setUrl]));
  const [removeProblemHistory] = useStore(useShallow((s) => [s.removeProblemHistory]));

  const [level, setLevel] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(`http://localhost:3000/api/solved?problemId=${problemInfo.number}`).then((res) =>
          res.json(),
        );

        setLevel(data.level || -1);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [problemInfo]);

  const handleHistoryBarItemClick = () => {
    setProblem(problemInfo);
    setWebViewUrl(`https://${BOJ_DOMAIN}/problem/${problemInfo.number}`);
  };

  const handleHistoryBarItemCloseButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const nextProblem = removeProblemHistory(index);

    if (!nextProblem) {
      setProblem(null);
      setWebViewUrl(`https://${BOJ_DOMAIN}/problemset`);
    } else if (nextProblem && problem?.number === problemInfo.number) {
      setProblem(nextProblem);
      setWebViewUrl(`https://${BOJ_DOMAIN}/problem/${nextProblem.number}`);
    }

    e.stopPropagation();
  };

  const isSelect = problem?.number === problemInfo.number;

  return (
    <HistoryBarItemLayout onClick={handleHistoryBarItemClick}>
      {isSelect && <HistoryBarItemDecoratorBox direction="left" />}
      <HistoryBarItemContentBox isSelect={isSelect}>
        <div
          css={css`
            display: flex;
            justify-content: center;
            width: 12px;
            height: 14px;
          `}
        >
          {level !== -1 && (
            <img
              src={`https://static.solved.ac/tier_small/${level}.svg`}
              alt=""
              css={css`
                width: 100%;
                height: 100%;
              `}
            />
          )}
        </div>
        <HistoryBarItemContentParagraph>
          {`${problemInfo.number}번: ${problemInfo.name}`}
        </HistoryBarItemContentParagraph>

        <HistoryBarItemCloseButton
          type="button"
          aria-label="tab-close-button"
          onClick={handleHistoryBarItemCloseButtonClick}
        >
          <X />
        </HistoryBarItemCloseButton>
      </HistoryBarItemContentBox>
      {isSelect && <HistoryBarItemDecoratorBox direction="right" />}
    </HistoryBarItemLayout>
  );
}
