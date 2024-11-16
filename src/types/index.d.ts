type MessageTemplate<T> = {
  data: T;
};

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type ProblemInfo = {
  name: string;
  number: string;
  testCase: {
    inputs: string[];
    outputs: string[];
  };
};

type EditorMode = 'vim' | 'normal';

type Langauge = 'node.js' | 'C++14' | 'Java11' | 'Python3';

type CodeInfo = {
  code: string;
  number: string;
  language: Langauge;
};

type JudgeResult = {
  index: number;
  result: '성공' | '시간 초과' | '에러 발생' | '실패';
  stderr: string;
  stdout: string;
  elapsed: number;
};

type SaveResult = {
  isSaved: boolean;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TC = {
  input: string;
  output: string;
  type: 'problem' | 'custom';
};
