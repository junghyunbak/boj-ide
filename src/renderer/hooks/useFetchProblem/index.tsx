import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { FETCH_DOMAIN } from '@/constants';

export function useFetchProblem(problemNumber: string) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(-1);

  const [tierBase64, setTierBase64] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const path = `/api/solved?problemId=${problemNumber}`;

        const data = (await fetch(`${FETCH_DOMAIN}${path}`).then((res) => res.json())) as {
          level: number;
          titleKo: string;
          tierBase64: string;
        };

        setLevel(data.level);
        setTitle(data.titleKo);
        setTierBase64(data.tierBase64);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [problemNumber]);

  return {
    TierImg:
      level !== -1 ? (
        <img
          src={tierBase64}
          alt=""
          css={css`
            width: 100%;
            height: 100%;
          `}
          draggable={false}
        />
      ) : null,
    title,
  };
}
