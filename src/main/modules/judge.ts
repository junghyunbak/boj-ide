/* eslint-disable no-cond-assign */
import { app, BrowserWindow } from 'electron';

import fs from 'fs';
import path from 'path';

import { customSpawn, normalizeOutput, ipc, checkCli, removeAnsiText } from '@/main/utils';

import { MAX_BUFFER_SIZE, MAX_LINE_LENGTH, langToJudgeInfo } from '@/main/constants';

import { sentryLogging } from '@/main/error';

import { ChildProcessWithoutNullStreams } from 'child_process';

import { Code } from './code';

type ErrorMessage = string;

export class Judge {
  private basePath: string;

  private mainWindow: BrowserWindow;

  private codeModule: Code;

  private judgeProcesses: ChildProcessWithoutNullStreams[] = [];

  constructor(mainWindow: BrowserWindow) {
    this.basePath = app.getPath('userData');
    this.mainWindow = mainWindow;
    this.codeModule = new Code(mainWindow);
  }

  private needCompile(language: Language) {
    return langToJudgeInfo[language].compile !== undefined;
  }

  private getCliType(language: Language) {
    switch (language) {
      case 'node.js':
      case 'Python3':
        return '인터프리터';
      case 'C++14':
      case 'C++17':
      case 'Java11':
      default:
        return '컴파일러';
    }
  }

  private isCliExist(language: Language) {
    if (!checkCli(langToJudgeInfo[language].cli)) {
      throw new Error(
        [
          `${this.getCliType(language)} \`${langToJudgeInfo[language].cli}\` 가 설치되어있지 않습니다.`,
          `<img src="https://github.com/user-attachments/assets/bf775ca3-db48-4112-95b7-4e2bc876755c" style="width: 500px"/>`,
          `프로그램 설치 후 환경변수 설정을 통해 \`--version\` 명령어로 버전을 확인할 수 있어야 합니다.<br/><br/>`,
          `[참고 Q&A] ["Python3을 분명 설치했음에도 이를 인식하지 못합니다."](https://boj-ide.gitbook.io/boj-ide-docs/qa/cli)`,
        ].join('\n\n'),
      );
    }
  }

  private getCompileCmd(data: MyOmit<CodeInfo, 'code'>) {
    const { language } = data;

    let cmd: `${Cli} ${string}` | undefined;

    if (
      !langToJudgeInfo[language].compile ||
      !(cmd = langToJudgeInfo[language].compile(data.number)[process.platform])
    ) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    return cmd;
  }

  private getExecuteCmdArgs(data: MyOmit<CodeInfo, 'code'>) {
    const executeCmd = langToJudgeInfo[data.language].executeArgs(data.number)[process.platform];

    if (!executeCmd) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    return executeCmd;
  }

  private getExecuteProgram(data: MyOmit<CodeInfo, 'code'>) {
    if (data.language === 'C++14' || data.language === 'C++17') {
      return process.platform === 'win32' ? `${data.number}.exe` : `./${data.number}`;
    }

    const { program } = langToJudgeInfo[data.language];

    if (!program) {
      throw new Error('지원하지 않는 언어입니다.');
    }

    return program;
  }

  private async compile({ language, code, number }: CodeInfo): Promise<ErrorMessage | null> {
    if (!this.needCompile(language)) {
      return null;
    }

    this.codeModule.save({ language, code, number });

    if (language === 'Java11') {
      fs.writeFileSync(path.join(this.basePath, 'Main.java'), code, { encoding: 'utf-8' });
    }

    const compileCmd = this.getCompileCmd({ language, number });

    const stderr = await new Promise<string>((resolve) => {
      let error = '';

      const ps = customSpawn.async(compileCmd, [], { cwd: this.basePath, shell: true });

      ps.stderr.on('data', (buf) => {
        error += buf.toString();
      });

      ps.on('close', () => {
        resolve(error);
      });
    });

    return stderr;
  }

  private execute(program: string, args: string[], input: string) {
    return new Promise<{ stdout: string; stderr: string; signal: NodeJS.Signals | null; elapsed: number }>(
      (resolve, reject) => {
        const process = customSpawn.async(program, args, { stdio: ['pipe', 'pipe', 'pipe'], cwd: this.basePath });

        let stdoutBuffer = Buffer.alloc(0);
        let stderrBuffer = Buffer.alloc(0);

        this.judgeProcesses.push(process);

        process.stdin.write(input);
        process.stdin.end();

        const start = Date.now();

        const timeoutId = setTimeout(() => {
          process.kill('SIGTERM');
        }, 10000);

        process.stdout.on('data', (data) => {
          stdoutBuffer = Buffer.concat([stdoutBuffer, data]);

          if (stdoutBuffer.length > MAX_BUFFER_SIZE) {
            process.kill('SIGTERM');
          }
        });

        process.stderr.on('data', (data) => {
          stderrBuffer = Buffer.concat([stderrBuffer, data]);

          if (stderrBuffer.length > MAX_BUFFER_SIZE) {
            process.kill('SIGTERM');
          }
        });

        process.on('close', (code, signal) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          resolve({
            stdout: removeAnsiText(stdoutBuffer.toString()),
            stderr: removeAnsiText(stderrBuffer.toString()),
            signal,
            elapsed: Date.now() - start,
          });
        });

        process.on('error', (err) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          resolve({
            stdout: removeAnsiText(stdoutBuffer.toString()),
            stderr: removeAnsiText(stderrBuffer.toString()),
            signal: 'SIGTERM',
            elapsed: Date.now() - start,
          });
        });
      },
    );
  }

  build() {
    ipc.on('stop-judge', async () => {
      // BUG: 컴파일 중 stop-judge 요청 시 아무일도 발생하지 않음.
      this.judgeProcesses = this.judgeProcesses.filter((process) => !(process.killed || process.exitCode === 0));

      this.judgeProcesses.forEach((process) => {
        process.kill('SIGKILL');
      });
    });

    ipc.on(
      'judge-start',
      async (
        e,
        {
          data: {
            number,
            code,
            language,
            judgeId,
            testCase: { inputs, outputs },
          },
        },
      ) => {
        sentryLogging('[로그] 사용자가 코드를 실행하였습니다.', {
          tags: {
            number,
            language,
          },
        });

        // 1. cli 존재여부 체크
        this.isCliExist(language);

        // 2. 컴파일
        const error = await this.compile({ language, code, number });

        if (error) {
          for (let index = 0; index < inputs.length; index += 1) {
            ipc.send(this.mainWindow.webContents, 'judge-result', {
              data: { index, stderr: error, stdout: '', elapsed: 0, result: '컴파일 에러', id: judgeId },
            });
          }

          return;
        }

        // 3. 채점 시작
        const program = this.getExecuteProgram({ language, number });
        const args = this.getExecuteCmdArgs({ language, number });

        await Promise.all(
          inputs.map((input, index) =>
            (async () => {
              const { stderr, stdout, signal, elapsed } = await this.execute(program, args, input);

              const result = ((): JudgeResult['result'] => {
                if (signal === 'SIGKILL') {
                  return '실행 중단';
                }

                if (stderr.length !== 0) {
                  return '런타임 에러';
                }

                if (signal === 'SIGTERM') {
                  return stdout.split('\n').length > MAX_LINE_LENGTH ? '출력 초과' : '시간 초과';
                }

                if (stdout.length !== 0 && normalizeOutput(stdout) === normalizeOutput(outputs[index])) {
                  return '맞았습니다!!';
                }

                return '틀렸습니다';
              })();

              let output = stdout;

              if (output.split('\n').length > MAX_LINE_LENGTH) {
                output = stdout
                  .split('\n')
                  .slice(0, MAX_LINE_LENGTH + 1)
                  .join('\n');
                output += '\n\n출력이 너무 깁니다.';
              }

              ipc.send(this.mainWindow.webContents, 'judge-result', {
                data: { index, stderr, stdout: output, elapsed, result, id: judgeId },
              });
            })(),
          ),
        );
      },
    );
  }
}
