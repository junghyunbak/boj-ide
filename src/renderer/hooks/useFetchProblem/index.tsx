import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { FETCH_DOMAIN } from '@/constants';

export function useFetchSolvedACProblemData(problemNumber: string) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(-1);

  useEffect(() => {
    (async () => {
      try {
        const path = `/api/solved?problemId=${problemNumber}`;

        const data = await fetch(`${FETCH_DOMAIN}${path}`).then((res) => res.json());

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
