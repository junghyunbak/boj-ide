import { app, WebContents } from 'electron';

import fs from 'fs';

import { spawnSync } from 'child_process';

import path from 'path';

import { normalizeOutput, removeAnsiText } from '../../utils';

import { ipc } from '../../types/ipc';

type JudgeInfo = {
  cli: Cli;
  ext: Partial<Record<NodeJS.Platform, string>>;
  compile?: (fileName?: string) => Partial<Record<NodeJS.Platform, string>>;
  execute: (fileName?: string) => Partial<Record<NodeJS.Platform, string>>;
};

export const langToJudgeInfo: Record<Language, JudgeInfo> = {
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

export function checkCli(cli: string) {
  const { stdout } = spawnSync(`${cli} --version`, { shell: true });

  return /[0-9]+\.[0-9]+\.[0-9]+/.test(stdout.toString());
}

export function compile({
  language,
  code,
  fileName,
  basePath,
  platform,
}: {
  language: Language;
  code: string;
  fileName: string;
  basePath: string;
  platform: NodeJS.Platform;
}) {
  const ext = langToJudgeInfo[language].ext[platform];

  if (!ext) {
    throw new Error('지원하지 않는 플랫폼입니다.');
  }

  if (langToJudgeInfo[language].compile) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, { encoding: 'utf-8' });

    if (language === 'Java11') {
      fs.writeFileSync(path.join(basePath, 'Main.java'), code, { encoding: 'utf-8' });
    }

    const compileCmd = langToJudgeInfo[language].compile(fileName)[platform];

    if (compileCmd === undefined) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    const { stderr } = spawnSync(compileCmd, { cwd: basePath, shell: true, timeout: 6000 });

    if (stderr.length !== 0) {
      throw new Error(`컴파일 에러\n\n${stderr.toString()}`);
    }
  }
}

export function execute(
  language: Language,
  fileName: string,
  input: string,
  output: string,
  basePath: string,
): { result: JudgeResult['result']; elapsed: number; stdout: string; stderr: string } {
  fs.writeFileSync(path.join(basePath, 'input'), input);

  const executeCmd = langToJudgeInfo[language].execute(fileName)[process.platform];

  if (!executeCmd) {
    throw new Error('지원하지 않는 플랫폼입니다.');
  }

  const start = Date.now();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { stderr, stdout, signal } = spawnSync(executeCmd, {
    cwd: basePath,
    input,
    shell: true,
    timeout: 6000,
  });

  const end = Date.now();

  const elapsed = end - start;

  const processOutput = removeAnsiText(stdout.toString());

  const result = ((): JudgeResult['result'] => {
    if (stderr.length !== 0) {
      return '에러 발생';
    }

    if (signal === 'SIGTERM') {
      return '시간 초과';
    }

    if (stdout.length !== 0 && normalizeOutput(processOutput) === normalizeOutput(output)) {
      return '성공';
    }

    return '실패';
  })();

  return { result, elapsed, stdout: processOutput, stderr: stderr.toString() };
}

export class Judge {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  build() {
    ipc.on(
      'judge-start',
      (
        e,
        {
          data: {
            number,
            code,
            language,
            testCase: { inputs, outputs },
          },
        },
      ) => {
        if (!checkCli(langToJudgeInfo[language].cli)) {
          throw new Error('프로그램이 설치되어 있지 않습니다.');
        }

        compile({ language, code, fileName: number, basePath: this.basePath, platform: process.platform });

        for (let i = 0; i < inputs.length; i += 1) {
          const { elapsed, stderr, stdout, result } = execute(language, number, inputs[i], outputs[i], this.basePath);

          ipc.send(this.webContents, 'judge-result', {
            data: { index: i, stderr: stderr.toString(), stdout, elapsed, result },
          });
        }
      },
    );
  }
}
