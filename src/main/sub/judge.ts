import { app, WebContents } from 'electron';

import fs from 'fs';

import { spawn } from 'child_process';

import path from 'path';

import { normalizeOutput } from '../util';

import { ipc } from '../../types/ipc';

import { IpcError } from '../../error';

const EXIT_CODE = {
  TIMEOUT: null,
  ERROR: 1,
  CLOSE: 0,
};

type BuildFileName = string;

export class Judge {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  build() {
    ipc.on('judge-start', async (e, { data }) => {
      await this.execute(data);
    });
  }

  async execute({ number, code, ext, testCase: { inputs, outputs } }: CodeInfo & ProblemInfo) {
    await this.checkProgram(ext);

    const buildFileName = await this.codeBuild(ext, number, code);

    const executeCommand = this.createExecuteCommand(buildFileName, ext);

    await this.run(executeCommand, inputs, outputs);
  }

  async codeBuild(ext: Ext, problemNumber: string, code: string): Promise<BuildFileName> {
    switch (ext) {
      case 'cpp': {
        const fileName = `${problemNumber}.cc`;
        const filePath = path.join(this.basePath, fileName);

        fs.writeFileSync(filePath, code);

        const outFileName = problemNumber;

        const buildResult = await new Promise((resolve) => {
          const buildProcess = spawn(`g++ ${fileName} -o ${outFileName} -O2 -Wall -lm -static -std=gnu++14`, {
            cwd: this.basePath,
            shell: true,
          });

          buildProcess.on('close', (exitCode) => {
            resolve(exitCode !== EXIT_CODE.ERROR);
          });

          buildProcess.on('error', () => {
            resolve(false);
          });
        });

        if (!buildResult) {
          throw new IpcError('빌드 에러', 'build-error');
        }

        /**
         * 윈도우만 지원한다고 가정
         */
        return `${outFileName}.exe`;
      }

      /**
       * 파이썬도 컴파일이 필요?
       */
      case 'py':
      case 'js':
      default:
        return `${problemNumber}.${ext}`;
    }
  }

  createExecuteCommand(buildFileName: string, ext: Ext): string {
    switch (ext) {
      case 'cpp':
        return `${process.platform === 'win32' ? '' : './'}${buildFileName}`;

      case 'js':
        return `node ${buildFileName}`;

      case 'py':
        return `python3 -W ignore ${buildFileName}`;

      default:
        return '';
    }
  }

  async checkProgram(ext: Ext) {
    const program = (() => {
      switch (ext) {
        case 'py':
          return 'python3';

        case 'cpp':
          return 'g++';

        case 'js':
          return 'node';

        default:
          return '';
      }
    })();

    let output = '';

    const isInstalled = await new Promise((resolve) => {
      const process = spawn(`${program} --version`, {
        shell: true,
      });

      process.stdout.on('data', (buf) => {
        output += buf.toString();
      });

      process.on('close', () => {
        resolve(/[0-9]+\.[0-9]+\.[0-9]+/.test(output));
      });
    });

    if (!isInstalled) {
      throw new IpcError('프로그램이 설치되어 있지 않습니다.', 'build-error');
    }
  }

  async run(cmd: string, inputs: string[], outputs: string[]) {
    for (let i = 0; i < inputs.length; i += 1) {
      let error = '';
      let output = '';

      fs.writeFileSync(path.join(this.basePath, 'input'), inputs[i]);

      const start: number = Date.now();
      let end: number = Date.now();

      const result = await new Promise<JudgeResult['result']>((resolve) => {
        const inputProcess = spawn(`type input`, {
          cwd: this.basePath,
          shell: true,
        });

        const outputProcess = spawn(cmd, {
          cwd: this.basePath,
          shell: true,
          timeout: 5000,
        });

        inputProcess.stdout.pipe(outputProcess.stdin);

        outputProcess.stdout.on('data', (buf) => {
          output += this.removeAnsiText(buf.toString());
        });

        outputProcess.stdout.on('end', () => {
          resolve(normalizeOutput(output) === normalizeOutput(outputs[i]) ? '성공' : '실패');

          end = Date.now();
        });

        outputProcess.stderr.on('data', (buf) => {
          error = buf.toString();

          resolve('에러 발생');
        });

        outputProcess.on('close', (exitCode) => {
          if (exitCode === EXIT_CODE.TIMEOUT) {
            resolve('시간 초과');
          }

          resolve('실패');
        });
      });

      const elapsed = end - start;

      ipc.send(this.webContents, 'judge-result', {
        data: { index: i, stderr: error, stdout: output, elapsed, result },
      });
    }
  }

  removeAnsiText(text: string) {
    /**
     * 자주 사용되지 않는 정규식이라고 에러를 발생시키는 것이므로 비활성화해도 상관없다고 판단.
     *
     * https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression
     */
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
  }
}
