import { app, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';

import { ipc } from '../../types/ipc';

import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE, PY_INPUT_TEMPLATE, JAVA_CODE_TEMPLATE } from '../../constants';

import { langToJudgeInfo } from './judge';

export class Code {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  build() {
    ipc.on('save-code', (e, { data: { number, language, code, silence } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      try {
        fs.writeFileSync(path.join(this.basePath, `${number}.${ext}`), code, {
          encoding: 'utf-8',
        });

        if (!silence) {
          ipc.send(this.webContents, 'save-code-result', { data: { isSaved: true } });
        }
      } catch (_) {
        throw new Error('코드 저장에 실패하였습니다.');
      }
    });

    ipc.on('load-code', (e, { data: { number, language } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      const filePath = path.join(this.basePath, `${number}.${ext}`);

      if (!fs.existsSync(filePath)) {
        const code = (() => {
          switch (language) {
            case 'C++14':
            case 'C++17':
            case 'C++17 (Clang)':
              return CPP_INPUT_TEMPLATE;
            case 'node.js':
              return JS_INPUT_TEMPLATE;
            case 'Python3':
              return PY_INPUT_TEMPLATE;
            case 'Java11':
              return JAVA_CODE_TEMPLATE;
            default:
              return '';
          }
        })();

        fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
      }

      const code = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });

      ipc.send(this.webContents, 'load-code-result', { data: { code } });
    });
  }
}
