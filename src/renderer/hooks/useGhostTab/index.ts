import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useGhostTab() {
  const [ghostTabs, setGhostTabs] = useStore(useShallow((s) => [s.ghostTabs, s.setGhostTabs]));
  const [activeDailyProblem, setActiveDailyProblem] = useStore(
    useShallow((s) => [s.activeDailyProblem, s.setActiveDailyProblem]),
  );

  const yyyymmdd = (() => {
    const today = new Date();

    return `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
  })();

  const { data } = useQuery<string[]>({
    queryKey: [yyyymmdd],
    queryFn: async () => {
      const res = await fetch('https://api.github.com/repos/tony9402/baekjoon/contents/scripts/picked.json');

      if (!res.ok) {
        return [];
      }

      const returnData = await res.json();

      const parseData = JSON.parse(atob(returnData.content || ''));

      if (!(parseData instanceof Object)) {
        return [];
      }

      if (!(parseData[yyyymmdd] instanceof Array)) {
        return [];
      }

      return parseData[yyyymmdd];
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setGhostTabs((prev) => {
      if (Object.keys(prev).includes(yyyymmdd)) {
        return prev;
      }

      return {
        [yyyymmdd]: data,
      };
    });
  }, [data, setGhostTabs, yyyymmdd]);

  const removeTab = useCallback(
    (removeProblemNumber: string) => {
      setGhostTabs((prev) => {
        if (!Object.keys(prev).includes(yyyymmdd)) {
          return prev;
        }

        const problemNumbers = prev[yyyymmdd];

        return {
          [yyyymmdd]: problemNumbers.filter((problemNumber) => problemNumber !== removeProblemNumber),
        };
      });
    },
    [setGhostTabs, yyyymmdd],
  );

  const toggleDailyProblemActive = useCallback(() => {
    setActiveDailyProblem(!activeDailyProblem);
  }, [activeDailyProblem, setActiveDailyProblem]);

  return { ghostTabs: ghostTabs[yyyymmdd] || [], removeTab, activeDailyProblem, toggleDailyProblemActive };
}
