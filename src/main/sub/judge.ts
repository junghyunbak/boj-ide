import { app, WebContents } from 'electron';

import fs from 'fs';

import { spawnSync } from 'child_process';

import path from 'path';

import { isContainVersion, langToJudgeInfo, normalizeOutput, removeAnsiText } from '../../utils';

import { ipc } from '../../types/ipc';

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
        /**
         * 프로그램 설치여부 확인
         */
        const { stdout } = spawnSync(`${langToJudgeInfo[language].cli} --version`, { shell: true });

        if (!isContainVersion(stdout.toString())) {
          throw new Error('프로그램이 설치되어 있지 않습니다.');
        }

        /**
         * 언어에 따라 빌드 수행
         */
        const ext = langToJudgeInfo[language].ext[process.platform];

        if (!ext) {
          throw new Error('지원하지 않는 언어입니다.');
        }

        if (langToJudgeInfo[language].compile) {
          fs.writeFileSync(path.join(this.basePath, `${number}.${ext}`), code, { encoding: 'utf-8' });

          if (language === 'Java11') {
            fs.writeFileSync(path.join(this.basePath, 'Main.java'), code, { encoding: 'utf-8' });
          }

          const compileCmd = langToJudgeInfo[language].compile(number)[process.platform];

          if (!compileCmd) {
            throw new Error('지원하지 않는 플랫폼입니다.');
          }

          const { stderr } = spawnSync(compileCmd, { cwd: this.basePath, shell: true, timeout: 6000 });

          if (stderr.length !== 0) {
            throw new Error(`컴파일 에러\n\n${stderr.toString()}`);
          }
        }

        /**
         * 채점 진행
         */
        for (let i = 0; i < inputs.length; i += 1) {
          fs.writeFileSync(path.join(this.basePath, 'input'), inputs[i]);

          const executeCmd = langToJudgeInfo[language].execute(number)[process.platform];

          if (!executeCmd) {
            throw new Error('지원하지 않는 플랫폼입니다.');
          }

          const start = Date.now();

          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { stderr, stdout, signal } = spawnSync(executeCmd, {
            cwd: this.basePath,
            input: inputs[i],
            shell: true,
            timeout: 6000,
          });

          const end = Date.now();

          const output = removeAnsiText(stdout.toString());

          const result = (() => {
            if (stderr.length !== 0) {
              return '에러 발생';
            }

            if (signal === 'SIGTERM') {
              return '시간 초과';
            }

            if (stdout.length !== 0 && normalizeOutput(output) === normalizeOutput(outputs[i])) {
              return '성공';
            }

            return '실패';
          })();

          ipc.send(this.webContents, 'judge-result', {
            data: { index: i, stderr: stderr.toString(), stdout: output, elapsed: end - start, result },
          });
        }
      },
    );
  }
}
