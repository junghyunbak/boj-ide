import { app, WebContents } from 'electron';

import fs from 'fs';

import { spawnSync } from 'child_process';

import path from 'path';

import { isContainVersion, langToJudgeInfo, normalizeOutput, removeAnsiText } from '../../utils';

import { ipc } from '../../types/ipc';

export function checkCli(language: Langauge) {
  const { stdout } = spawnSync(`${langToJudgeInfo[language].cli} --version`, { shell: true });

  if (!isContainVersion(stdout.toString())) {
    throw new Error('프로그램이 설치되어 있지 않습니다.');
  }
}

export function compile(language: Langauge, code: string, fileName: string, basePath: string) {
  const ext = langToJudgeInfo[language].ext[process.platform];

  if (!ext) {
    throw new Error('지원하지 않는 언어입니다.');
  }

  if (langToJudgeInfo[language].compile) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, { encoding: 'utf-8' });

    if (language === 'Java11') {
      fs.writeFileSync(path.join(basePath, 'Main.java'), code, { encoding: 'utf-8' });
    }

    const compileCmd = langToJudgeInfo[language].compile(fileName)[process.platform];

    if (!compileCmd) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    const { stderr } = spawnSync(compileCmd, { cwd: basePath, shell: true, timeout: 6000 });

    if (stderr.length !== 0) {
      throw new Error(`컴파일 에러\n\n${stderr.toString()}`);
    }
  }
}

export function execute(
  language: Langauge,
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
        checkCli(language);
        compile(language, code, number, this.basePath);

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
