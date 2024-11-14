import { app, BrowserWindow } from 'electron';

import fs from 'fs';

import { spawn } from 'child_process';

import path from 'path';

import { normalizeOutput } from './util';

import { ipc } from '../types/ipc';
import { IpcError } from '../error';

const EXIT_CODE = {
  TIMEOUT: null,
  ERROR: 1,
  CLOSE: 0,
};

type BuildFileName = string;

export class Judge {
  private basePath: string;

  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.basePath = app.getPath('userData');

    this.mainWindow = mainWindow;
  }

  async execute({
    problemNumber,
    code,
    ext,
    inputs,
    outputs,
  }: {
    problemNumber: string;
    code: string;
    ext: Ext;
    inputs: string[];
    outputs: string[];
  }) {
    const buildFileName = await this.build(ext, problemNumber, code);

    const executeCommand = this.createExecuteCommand(buildFileName, ext);

    await this.run(executeCommand, inputs, outputs);
  }

  async build(ext: Ext, problemNumber: string, code: string): Promise<BuildFileName> {
    // [ ]: 빌드 가능한지 체크

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

      case 'js':
      default:
        return `${problemNumber}.${ext}`;
    }
  }

  createExecuteCommand(buildFileName: string, ext: string): string {
    switch (ext) {
      case 'cpp':
        return `${process.platform === 'win32' ? '' : './'}${buildFileName}`;

      case 'js':
        return `node ${buildFileName}`;

      default:
        return '';
    }
  }

  async run(cmd: string, inputs: string[], outputs: string[]) {
    for (let i = 0; i < inputs.length; i += 1) {
      let error = '';
      let output = '';

      fs.writeFileSync(path.join(this.basePath, 'input'), inputs[i]);

      let start: number = Date.now();
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

        start = Date.now();

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

      ipc.send(this.mainWindow.webContents, 'judge-result', {
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
