import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useDailyProblem() {
  const [dailyProblems] = useStore(useShallow((s) => [s.dailyProblem]));
  const [activeDailyProblem] = useStore(useShallow((s) => [s.activeDailyProblem]));

  const dailyProblemNumbers = dailyProblems ? dailyProblems[1] : [];

  return { dailyProblemNumbers, activeDailyProblem };
}
