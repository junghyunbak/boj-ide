import { useMemo, useRef } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '@/renderer/store';

import { v4 as uuidv4 } from 'uuid';

import { useProblem } from '../useProblem';

export function useTestcase() {
  const { problem } = useProblem();
  const [customTestcases] = useStore(useShallow((s) => [s.customTestCase]));

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

  return {
    allTestcase,
    tcKeyMap,
    customTestcases,
  };
}
