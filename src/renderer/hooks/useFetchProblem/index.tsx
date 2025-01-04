import { css } from '@emotion/react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { FETCH_DOMAIN } from '@/common/constants';

export function useFetchProblem(problemNumber: string): { TierImg: React.ReactNode | null; title: string } {
  const { data: solvedProblem, isError } = useQuery({
    queryKey: ['solved.ac', problemNumber],
    queryFn: async () => {
      const { data } = await axios.get<{ level: number; titleKo: string; tierBase64: string }>(
        `${FETCH_DOMAIN}/api/solved?problemId=${problemNumber}`,
      );

      return data;
    },
  });

  if (isError || !solvedProblem) {
    return {
      TierImg: null,
      title: '',
    };
  }

  const { titleKo, tierBase64 } = solvedProblem;

  const TierImg = (
    <img
      src={tierBase64}
      alt=""
      css={css`
        width: 100%;
        height: 100%;
      `}
      draggable={false}
    />
  );

  return {
    TierImg,
    title: titleKo,
  };
}
