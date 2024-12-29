import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';
import { LOCALHOST_DOMAIN, PRODUCTION_DOMAIN } from '@/constants';

const domain = process.env.NODE_ENV === 'production' ? `https://${PRODUCTION_DOMAIN}` : `http://${LOCALHOST_DOMAIN}`;

export function useFetchSolvedACProblemData(problemNumber: string) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const path = `/api/solved?problemId=${problemNumber}`;

        const data = await fetch(`${domain}${path}`).then((res) => res.json());

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
    api: `${domain}/api/ai/template`,
    experimental_throttle: 50,
  });

  return { complete, completion, isLoading, error };
}
