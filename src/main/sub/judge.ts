import { app, WebContents } from 'electron';

import fs from 'fs';

import { spawn } from 'child_process';

import path from 'path';

import {
  isContainVersion,
  lang2Bin,
  lang2BuildCmd,
  lang2ExecuteCmd,
  lang2Ext,
  lang2Tool,
  normalizeOutput,
  removeAnsiText,
  stdinCmd,
} from '../../utils';

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

  async execute({ number, code, language, testCase: { inputs, outputs } }: CodeInfo & ProblemInfo) {
    await this.checkTool(language);

    const buildFileName = await this.buildCode(language, number, code);

    const executeCmd = lang2ExecuteCmd(language, buildFileName, process.platform);

    await this.run(executeCmd, inputs, outputs);
  }

  async checkTool(language: Langauge) {
    let output = '';

    await new Promise((resolve) => {
      const process = spawn(`${lang2Tool(language)} --version`, {
        shell: true,
      });

      process.stdout.on('data', (buf) => {
        output += buf.toString();
      });

      process.on('error', () => {
        resolve(true);
      });

      process.on('close', () => {
        resolve(true);
      });
    });

    if (!isContainVersion(output)) {
      throw new IpcError('프로그램이 설치되어 있지 않습니다.', 'build-error');
    }
  }

  async buildCode(language: Langauge, fileName: string, code: string): Promise<BuildFileName> {
    fs.writeFileSync(path.join(this.basePath, `${fileName}.${lang2Ext(language, process.platform)}`), code, {
      encoding: 'utf-8',
    });

    if (language === 'node.js' || language === 'Python3') {
      return `${fileName}.${lang2Ext(language, process.platform)}`;
    }

    let error = '';

    await new Promise((resolve) => {
      const ps = spawn(lang2BuildCmd(language, fileName, process.platform), {
        cwd: this.basePath,
        shell: true,
      });

      ps.stderr.on('data', (buf) => {
        error += buf.toString();
      });

      ps.on('error', () => {
        error = 'execute error';
        resolve(true);
      });
      ps.on('close', () => resolve(true));
    });

    if (error !== '') {
      throw new IpcError(error, 'build-error');
    }

    return lang2Bin(language, fileName, process.platform);
  }

  async run(executeCmd: string, inputs: string[], outputs: string[]) {
    for (let i = 0; i < inputs.length; i += 1) {
      fs.writeFileSync(path.join(this.basePath, 'input'), inputs[i]);

      let error = '';
      let output = '';
      let exitCode;

      const start: number = Date.now();
      let end: number = Date.now();

      await new Promise((resolve) => {
        const inputProcess = spawn(stdinCmd(process.platform, 'input'), {
          cwd: this.basePath,
          shell: true,
        });

        const outputProcess = spawn(executeCmd, {
          cwd: this.basePath,
          shell: true,
        });

        inputProcess.stdout.pipe(outputProcess.stdin);

        outputProcess.on('error', () => {
          resolve(true);
        });

        outputProcess.on('close', () => {
          end = Date.now();

          resolve(true);
        });

        outputProcess.stdout.on('data', (buf) => {
          output += removeAnsiText(buf.toString());
        });

        outputProcess.stderr.on('data', (buf) => {
          error += buf.toString();
        });

        outputProcess.on('close', (_exitCode) => {
          exitCode = _exitCode;

          resolve(true);
        });

        setTimeout(() => {
          exitCode = EXIT_CODE.TIMEOUT;

          resolve(true);
        }, 6000);
      });

      const elapsed = end - start;

      const result: JudgeResult['result'] = (() => {
        if (error !== '') {
          return '에러 발생';
        }

        if (exitCode === EXIT_CODE.TIMEOUT) {
          return '시간 초과';
        }

        if (output !== '') {
          return normalizeOutput(output) === normalizeOutput(outputs[i]) ? '성공' : '실패';
        }

        return '실패';
      })();

      ipc.send(this.webContents, 'judge-result', {
        data: { index: i, stderr: error, stdout: output, elapsed, result },
      });
    }
  }
}
