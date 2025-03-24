interface TestcaseTitleProps {
  num: number;
  type?: TCType;
}

export function TestcaseTitle({ num, type = 'problem' }: TestcaseTitleProps) {
  const title = (() => {
    if (type === 'problem') {
      return `테스트케이스 ${num}`;
    }

    return `사용자 테스트케이스 ${num}`;
  })();

  return <div>{title}</div>;
}
