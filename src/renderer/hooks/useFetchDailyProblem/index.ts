import { createDateString } from '@/renderer/utils';
import { useQuery } from '@tanstack/react-query';
import { Octokit } from 'octokit';

const octokit = new Octokit({ throttle: { enabled: false } });

export function useFetchDailyProblem() {
  const today = new Date();

  const yyyySmmSdd = createDateString(today, 'yyyySmmSdd');

  const { data: dailyProblems } = useQuery({
    queryKey: [yyyySmmSdd],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: 'tony9402',
          repo: 'baekjoon',
          path: '/scripts/picked.json',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        if (data instanceof Array || data.type !== 'file') {
          throw new Error('');
        }

        const dateToProblemNumbers = JSON.parse(atob(data.content));

        if (!(dateToProblemNumbers instanceof Object)) {
          throw new Error('');
        }

        const problemNumbers = dateToProblemNumbers[queryKey[0]];

        if (
          !(problemNumbers instanceof Array) ||
          !problemNumbers.length ||
          !problemNumbers.every((problemNumber) => typeof problemNumber === 'string')
        ) {
          throw new Error('');
        }

        return problemNumbers;
      } catch (e) {
        return null;
      }
    },
  });

  return {
    yyyySmmSdd,
    dailyProblems,
  };
}
