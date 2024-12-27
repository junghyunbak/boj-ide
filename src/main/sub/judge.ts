import { app, BrowserWindow, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { customSpawn } from '@/utils/customSpawn';
import { normalizeOutput } from '@/utils';
import { ipc } from '@/types/ipc';
import { MAX_BUFFER_SIZE, MAX_LINE_LENGTH } from '@/constants';
import { IpcError } from '@/error';
import { langToJudgeInfo } from '@/constants/judge';
import { Code } from './code';

export function checkCli(cli: string) {
  const { stdout } = customSpawn.sync(`${cli} --version`, { shell: true });

  return /[0-9]+\.[0-9]+\.[0-9]+/.test(stdout.toString());
}

export async function compile({
  language,
  code,
  fileName,
  basePath,
  ext,
}: {
  language: Language;
  code: string;
  fileName: string;
  basePath: string;
  ext: string;
}) {
  if (langToJudgeInfo[language].compile) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, { encoding: 'utf-8' });

    // BUG: java 파일이 비어있을 경우에도 Main.java 파일이 갱신되지 않음.
    if (language === 'Java11') {
      fs.writeFileSync(path.join(basePath, 'Main.java'), code, { encoding: 'utf-8' });
    }

    const compileCmd = langToJudgeInfo[language].compile(fileName)[process.platform];

    if (compileCmd === undefined) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    const stderr = await new Promise((resolve) => {
      let error = '';

      const ps = customSpawn.async(compileCmd, { cwd: basePath, shell: true });

      ps.stderr.on('data', (buf) => {
        error += buf.toString();
      });

      ps.on('close', () => {
        resolve(error);
      });
    });

    if (stderr !== '') {
      throw new IpcError(`컴파일 에러\n\n${stderr}`, 'personal');
    }
  }
}

export class Judge {
  private basePath: string;

  private webContents: WebContents;

  constructor(mainWindow: BrowserWindow) {
    this.basePath = app.getPath('userData');

    this.webContents = mainWindow.webContents;
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
            testCase: { inputs, outputs },
          },
        },
      ) => {
        const ext = langToJudgeInfo[language].ext[process.platform];

        if (!ext) {
          throw new Error('지원하지 않는 플랫폼입니다.');
        }

        /**
         * cli 존재여부 체크
         */
        if (!checkCli(langToJudgeInfo[language].cli)) {
          throw new Error(
            `프로그램이 설치되어 있지 않습니다.\n\ncli \`${langToJudgeInfo[language].cli}\` 가 설치되어 있어야 합니다.\n\n설치 후 재시작해주세요.`,
          );
        }

        /**
         * 코드 저장
         */
        Code.saveFile(this.basePath, number, ext, code);

        /**
         * 컴파일
         */
        await compile({ language, code, fileName: number, basePath: this.basePath, ext });

        /**
         * 채점 시작
         */
        const executeCmd = langToJudgeInfo[language].execute(number)[process.platform];

        if (!executeCmd) {
          throw new Error('지원하지 않는 플랫폼입니다.');
        }

        for (let index = 0; index < inputs.length; index += 1) {
          (() => {
            const worker = new Worker(path.join(__dirname, 'worker'));

            worker.once('message', (data) => {
              const { stderr, stdout, signal, elapsed } = data;

              const outputBufferSize = Buffer.byteLength(stdout, 'utf-8');

              const result = ((): JudgeResult['result'] => {
                if (stderr.length !== 0) {
                  return '런타임 에러';
                }

                if (signal === 'SIGTERM') {
                  return outputBufferSize > MAX_BUFFER_SIZE ? '출력 초과' : '시간 초과';
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

              ipc.send(this.webContents, 'judge-result', {
                data: { index, stderr, stdout: output, elapsed, result },
              });

              worker.terminate();
            });

            // [ ]: 타입 안정성 작업 필요
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
