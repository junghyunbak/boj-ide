type Cli = 'g++' | 'javac' | 'node' | 'python3';

type JudgeInfo = {
  cli: Cli;
  ext: Partial<Record<NodeJS.Platform, string>>;
  compile?: (fileName?: string) => Partial<Record<NodeJS.Platform, string>>;
  execute: (fileName?: string) => Partial<Record<NodeJS.Platform, string>>;
};

export const langToJudgeInfo: Record<Langauge, JudgeInfo> = {
  'C++14': {
    cli: 'g++',
    ext: {
      win32: 'cpp',
      darwin: 'cc',
    },
    compile: (fileName) => ({
      win32: `g++ ${fileName}.cpp -o ${fileName} -std=gnu++14 -O2 -Wall -lm -static`,
      darwin: `g++ ${fileName}.cc -o ${fileName} -std=c++14`,
    }),
    execute: (fileName) => ({
      win32: `${fileName}.exe`,
      darwin: `./${fileName}`,
    }),
  },
  Java11: {
    cli: 'javac',
    ext: {
      win32: 'java',
      darwin: 'java',
    },
    compile: () => ({
      win32: 'javac --release 11 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
      darwin: 'javac --release 11 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
    }),
    execute: () => ({
      win32: 'java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC Main',
      darwin: 'java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC Main',
    }),
  },
  'node.js': {
    ext: {
      win32: 'js',
      darwin: 'js',
    },
    cli: 'node',
    execute: (fileName) => ({
      win32: `node ${fileName}.js`,
      darwin: `node ${fileName}.js`,
    }),
  },
  Python3: {
    ext: {
      win32: 'py',
      darwin: 'py',
    },
    cli: 'python3',
    execute: (fileName) => ({
      win32: `python3 -W ignore ${fileName}.py`,
      darwin: `python3 -W ignore ${fileName}.py`,
    }),
  },
};

export function normalizeOutput(output: string) {
  return output
    .trim()
    .split('\n')
    .map((line: string) => line.trim())
    .join('\n');
}

export const isContainVersion = (text: string) => /[0-9]+\.[0-9]+\.[0-9]+/.test(text);

/**
 * 자주 사용되지 않는 정규식이라고 에러를 발생시키는 것이므로 비활성화해도 상관없다고 판단.
 *
 * https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression
 */
// eslint-disable-next-line no-control-regex
export const removeAnsiText = (text: string) => text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');

export function lang2Ext(lang: Langauge, platform: typeof process.platform = 'win32') {
  switch (lang) {
    case 'Java11':
      return 'java';
    case 'C++14':
      return platform === 'win32' ? 'cpp' : 'cc';
    case 'node.js':
      return 'js';
    case 'Python3':
      return 'py';
    default:
      return '';
  }
}
