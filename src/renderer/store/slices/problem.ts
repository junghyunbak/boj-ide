import { type StateCreator } from 'zustand';

type ProblemSlice = {
  customTestCase: Record<string, TC[] | undefined>;
  addCustomTestCase(number: string, tc: TC): void;
  removeCustomTestCase(number: string, i: number): void;

  problem: ProblemInfo | null;
  setProblem(problem: ProblemInfo | null): void;

  problemHistories: ProblemInfo[];
  addProblemHistory(problemInfo: ProblemInfo): void;
  /**
   * 히스토리가 모두 비워졌을 경우 : null
   * 히스토리가 남아있을 경우 : 삭제 위치 다음 문제 (맨 마지막 요소일 경우, 삭제 위치 이전 문제)
   */
  removeProblemHistory(i: number): ProblemInfo | null;
};

export const createProblemSlice: StateCreator<ProblemSlice> = (set, get): ProblemSlice => ({
  customTestCase: {},
  addCustomTestCase(number, tc) {
    set((s) => {
      const next = {
        ...s.customTestCase,
      };

      if (!next[number]) {
        next[number] = [];
      }

      next[number].push(tc);

      return {
        customTestCase: next,
      };
    });
  },
  removeCustomTestCase(number, i) {
    set((s) => {
      const next = {
        ...s.customTestCase,
      };

      if (!next[number]) {
        return {
          customTestCase: next,
        };
      }

      next[number].splice(i, 1);

      return {
        customTestCase: next,
      };
    });
  },

  problem: null,
  setProblem(problem) {
    set(() => ({ problem }));
  },

  problemHistories: [],
  addProblemHistory(problemInfo) {
    set((s) => {
      const next = [...s.problemHistories];

      const idx = next.findIndex((v) => v.number === problemInfo.number);

      if (idx !== -1) {
        next.splice(idx, 1, problemInfo);

        return { problemHistories: next };
      }

      return {
        problemHistories: [...next, problemInfo],
      };
    });
  },
  removeProblemHistory(i) {
    const next = [...get().problemHistories];

    next.splice(i, 1);

    set(() => ({ problemHistories: next }));

    if (next.length === 0) {
      return null;
    }

    return next[i] === undefined ? next[i - 1] : next[i];
  },
});
