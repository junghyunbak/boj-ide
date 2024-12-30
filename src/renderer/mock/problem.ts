import { faker } from '@faker-js/faker';

export const createMockProblem = (() => {
  let number = -1;

  return (values?: Partial<ProblemInfo>): ProblemInfo => {
    number += 1;

    return {
      name: values?.name || 'A + B',
      number: number.toString(),
      testCase: values?.testCase || {
        inputs: [],
        outputs: [],
      },
    };
  };
})();

export const createMockTestcase = (values?: Partial<TC>): TC => {
  return {
    input: values?.input || faker.string.alpha(10),
    output: values?.output || faker.string.alpha(10),
    type: values?.type || 'problem',
  };
};
