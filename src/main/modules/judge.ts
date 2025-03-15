/* eslint-disable no-cond-assign */
import { app, BrowserWindow } from 'electron';

import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';

import { customSpawn, normalizeOutput, ipc, checkCli } from '@/main/utils';

import { MAX_LINE_LENGTH, langToJudgeInfo } from '@/main/constants';

import { sentryLogging } from '@/main/error';

import { Code } from './code';

type ErrorMessage = string;

export class Judge {
  private basePath: string;

  private mainWindow: BrowserWindow;

  private codeModule: Code;

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

  private getExecuteCmd(data: MyOmit<CodeInfo, 'code'>) {
    const executeCmd = langToJudgeInfo[data.language].execute(data.number)[process.platform];

    if (!executeCmd) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    return executeCmd;
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

      const ps = customSpawn.async(compileCmd, { cwd: this.basePath, shell: true });

      ps.stderr.on('data', (buf) => {
        error += buf.toString();
      });

      ps.on('close', () => {
        resolve(error);
      });
    });

    return stderr;
  }

  build() {
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
        const executeCmd = this.getExecuteCmd({ language, number });

        for (let index = 0; index < inputs.length; index += 1) {
          (() => {
            const worker = new Worker(path.join(__dirname, 'worker'));

            worker.on('exit', () => {
              worker.terminate();
            });

            worker.on('error', () => {
              worker.terminate();
            });

            worker.once('message', (data) => {
              const { stderr, stdout, signal, elapsed } = data;

              const result = ((): JudgeResult['result'] => {
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

              worker.terminate();
            });

            // TODO: 타입 안정성 작업 필요
            worker.postMessage({
              executeCmd,
              input: inputs[index],
              basePath: this.basePath,
            });
          })();
        }
      },
    );
  }
}
