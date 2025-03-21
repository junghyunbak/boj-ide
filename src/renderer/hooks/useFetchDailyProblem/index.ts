import { FETCH_DOMAIN } from '@/common/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

const dailyProblemScheme = z.object({
  date: z.string(),
  problems: z.array(
    z.object({
      problemId: z.string(),
      title: z.string(),
      level: z.number(),
    }),
  ),
});

export function useFetchDailyProblem() {
  const { data: dailyProblemObject } = useQuery({
    queryKey: [],
    queryFn: async () => {
      try {
        const { data } = await axios.get<z.infer<typeof dailyProblemScheme>>(`${FETCH_DOMAIN}/api/solved/daily`);

        const parseData = dailyProblemScheme.parse(data);

        return parseData;
      } catch (e) {
        return null;
      }
    },
  });

  if (!dailyProblemObject) {
    return null;
  }

  return {
    date: dailyProblemObject.date,
    problemNumbers: dailyProblemObject.problems.map((problem) => problem.problemId),
  };
}
