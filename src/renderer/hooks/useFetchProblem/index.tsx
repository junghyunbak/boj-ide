import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { FETCH_DOMAIN } from '@/common/constants';

export function useFetchProblem(problemNumber: string): { tierBase64: string | null; title: string } {
  const { data: solvedProblem, isError } = useQuery({
    queryKey: ['solved.ac', problemNumber],
    queryFn: async () => {
      const { data } = await axios.get<{ level: number; title: string; tierBase64: string }>(
        `${FETCH_DOMAIN}/api/solved?problemId=${problemNumber}`,
      );

      return data;
    },
  });

  if (isError || !solvedProblem) {
    return {
      tierBase64: null,
      title: '',
    };
  }

  const { title, tierBase64 } = solvedProblem;

  return {
    tierBase64,
    title,
  };
}
