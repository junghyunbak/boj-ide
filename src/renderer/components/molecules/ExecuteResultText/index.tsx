import { css } from '@emotion/react';

import { useJudge } from '@/renderer/hooks';

export function ExecuteResultText() {
  const { totalCount, correctCount, isJudgingEnd, isCorrect } = useJudge();

  if (!isJudgingEnd) {
    return null;
  }

  return (
    <p
      css={(theme) => css`
        ${isCorrect
          ? css`
              font-weight: bold;
              color: ${theme.common.colors.judge.correct};
            `
          : css`
              font-weight: normal;
              color: ${theme.common.colors.judge.wrong};
            `}
      `}
    >
      {`${totalCount}개 중 ${correctCount}개 성공`}
    </p>
  );
}
