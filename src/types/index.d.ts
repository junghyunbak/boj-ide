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

type Language = 'node.js' | 'C++14' | 'Java11' | 'Python3';

type Cli = 'g++' | 'javac' | 'node' | 'python3';

type CodeInfo = {
  code: string;
  number: string;
  language: Language;
};

type JudgeResult = {
  index: number;
  result: '맞았습니다!!' | '시간 초과' | '런타임 에러' | '틀렸습니다';
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
