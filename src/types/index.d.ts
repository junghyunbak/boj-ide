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

type Language = 'node.js' | 'C++14' | 'C++17' | 'Java11' | 'Python3';

type Compiler = 'g++' | 'javac';
type Executer = 'java' | 'node' | 'python3';

type Cli = Compiler | Executer;

type CodeInfo = {
  code: string;
  number: string;
  language: Language;
};

type JudgeInfo = {
  cli: Cli;
  ext: Partial<Record<NodeJS.Platform, string>>;
  compile?: (fileName?: string) => Partial<Record<NodeJS.Platform, `${Cli} ${string}`>>;
  // [ ]: template literal type 적용
  execute: (fileName?: string) => Partial<Record<NodeJS.Platform, string>>;
};

type JudgeResult = {
  index: number;
  result: '맞았습니다!!' | '시간 초과' | '런타임 에러' | '틀렸습니다' | '출력 초과';
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
