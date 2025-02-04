import { faker } from '@faker-js/faker';

export const createMockProblem = (() => {
  let number = 100000;

  return (values?: Partial<ProblemInfo>): ProblemInfo => {
    number += 1;

    return {
      name: values?.name || 'A + B',
      number: values?.number || number.toString(),
      testCase: values?.testCase || {
        inputs: [],
        outputs: [],
      },
      inputDesc: values?.inputDesc || faker.string.alpha(20),
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
