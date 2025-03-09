import { useCallback, useMemo, useRef } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';

import { v4 as uuidv4 } from 'uuid';

import { useProblem } from '../useProblem';
import { useModifyProblem } from '../useModifyProblem';

export function useTestcase() {
  const { problem } = useProblem();
  const { updateProblem } = useModifyProblem();
  const [customTestcases, setCustomTestcases] = useStore(useShallow((s) => [s.customTestCase, s.setCustomTestcases]));

  const problemTestcases = useMemo<TC[]>(() => {
    if (!problem) {
      return [];
    }

    const testcases: TC[] = [];

    for (let i = 0; i < problem.testCase.inputs.length; i += 1) {
      const testcase: TC = {
        input: problem.testCase.inputs[i],
        output: problem.testCase.outputs[i],
        type: 'problem',
      };

      testcases.push(testcase);
    }

    return testcases;
  }, [problem]);

  const allTestcase = useMemo(() => {
    if (!problem) {
      return [];
    }

    return [...problemTestcases, ...(customTestcases[problem.number] || [])];
  }, [problem, problemTestcases, customTestcases]);

  const tcKeyMap = useRef(new WeakMap()).current;

  allTestcase.forEach((tc) => {
    if (tcKeyMap.has(tc)) {
      return;
    }

    tcKeyMap.set(tc, uuidv4());
  });

  const addCustomTestcase = useCallback(
    (testcase: TC, problemNumber?: string) => {
      const number = problem?.number || problemNumber;

      if (!number) {
        return;
      }

      setCustomTestcases((prev) => ({ ...prev, [number]: [...(prev[number] || []), testcase] }));
    },
    [setCustomTestcases, problem],
  );

  const removeCustomTestcase = useCallback(
    (i: number) => {
      const number = problem?.number;

      if (!number) {
        return;
      }

      const testcases = customTestcases[number];

      if (!testcases || !testcases[i]) {
        return;
      }

      setCustomTestcases((prev) => ({ ...prev, [number]: [...(prev[number] || []).filter((_, j) => i !== j)] }));
    },
    [problem, customTestcases, setCustomTestcases],
  );

  // TODO: 테스트코드 작성
  const updateCustomTestcase = useCallback(
    (i: number, value: { input?: string; output?: string }) => {
      const number = problem?.number;

      if (!number) {
        return;
      }

      setCustomTestcases((prev) => {
        if (!prev[number] || !prev[number][i]) {
          return prev;
        }

        if (value.input) {
          prev[number][i].input = value.input;
        }

        if (value.output) {
          prev[number][i].output = value.output;
        }

        return prev;
      });
    },
    [problem, setCustomTestcases],
  );

  return {
    allTestcase,
    tcKeyMap,
    customTestcases,
    addCustomTestcase,
    removeCustomTestcase,
    updateCustomTestcase,
    /**
     * 테스트를 위해서 내보내기 하는 메서드
     */
    updateProblem,
  };
}
