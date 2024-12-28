import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';

export function useFetchSolvedACProblemData(problemNumber: string) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        // [ ]: 프로덕션 환경으로 나누기
        const data = await fetch(`http://localhost:3000/api/solved?problemId=${problemNumber}`).then((res) =>
          res.json(),
        );

        setLevel(data.level ?? -1);
        setTitle(data.titleKo || '');
      } catch (e) {
        console.log(e);
      }
    })();
  }, [problemNumber]);

  return {
    TierImg:
      level !== -1 ? (
        <img
          src={`https://static.solved.ac/tier_small/${level}.svg`}
          alt=""
          css={css`
            width: 100%;
            height: 100%;
          `}
        />
      ) : null,
    title,
  };
}

export function useStreamingAICode() {
  const { complete, completion, isLoading, error } = useCompletion({
    api:
      process.env.NODE_ENV === 'production'
        ? 'https://boj-ide.junghyunbak.site/api/ai/template'
        : 'http://localhost:3000/api/ai/template',
    experimental_throttle: 50,
  });

  return { complete, completion, isLoading, error };
}
