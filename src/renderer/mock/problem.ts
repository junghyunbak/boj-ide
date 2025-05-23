import { faker } from '@faker-js/faker';

export const createMockProblem = (() => {
  let number = 100000;

  return (values?: Partial<ProblemInfo>): ProblemInfo => {
    number += 1;

    return {
      name: values?.name || 'A + B',
      number: values?.number || number.toString(),
      testCase: values?.testCase || {
        inputs: ['input example'],
        outputs: ['output example'],
      },
      inputDesc: values?.inputDesc || faker.string.alpha(20),
    };
  };
})();

export const createMockBookmark = (() => {
  let number = 0;

  return (values?: Partial<BookmarkInfo>): BookmarkInfo => {
    number += 1;

    return {
      url: values?.url || `https://test${number}.com`,
      title: values?.title || '',
      path: values?.path,
    };
  };
})();

export const createMockExtension = (values?: Partial<ExtensionInfo>): ExtensionInfo => {
  return {
    id: values?.id || faker.string.uuid(),
    type: values?.type || 'baekjoonhub',
    path: values?.type || '',
    title: values?.title || '',
  };
};

export const createMockTestcase = (values?: Partial<TC>): TC => {
  return {
    input: values?.input || faker.string.alpha(10),
    output: values?.output || faker.string.alpha(10),
    type: values?.type || 'problem',
  };
};
