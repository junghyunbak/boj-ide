type Language = 'node.js' | 'C++14' | 'C++17' | 'Java11' | 'Python3';

type JudgeInfo = {
  cli: Cli;
  ext: Partial<Record<NodeJS.Platform, string>>;
  program?: Executer;
  compile?: (fileName?: string) => Partial<Record<NodeJS.Platform, `${Cli} ${string}`>>;
  executeArgs: (fileName?: string) => Partial<Record<NodeJS.Platform, string[]>>;
};

type JudgeResult = {
  id: string;
  index: number;
  result: '맞았습니다!!' | '시간 초과' | '런타임 에러' | '틀렸습니다' | '출력 초과' | '컴파일 에러' | '실행 중단';
  stderr: string;
  stdout: string;
  elapsed: number;
};

type Compiler = 'g++' | 'javac';
type Executer = 'java' | 'node' | 'python3';
type Cli = Compiler | Executer;

type TCType = 'problem' | 'custom';
type TC = {
  input: string;
  output: string;
  type: TCType;
};

type CodeInfo = {
  code: string;
  number: string;
  language: Language;
};
