export const createMockJudgeResult = (() => {
  let index = -1;

  return (values?: Partial<JudgeResult>): JudgeResult => {
    index += 1;

    return {
      id: values?.id || '',
      index,
      result: values?.result || '맞았습니다!!',
      stderr: values?.stderr || '',
      stdout: values?.stdout || '',
      elapsed: values?.elapsed || 0,
    };
  };
})();
