import { app, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';

import { ipc } from '../../types/ipc';
import { IpcError } from '../../error';

import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE, PY_INPUT_TEMPLATE, JAVA_CODE_TEMPLATE } from '../../constants';

import { lang2Ext } from '../../utils';

export class Code {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  build() {
    ipc.on('save-code', (e, { data: { number, language, code, silence } }) => {
      try {
        fs.writeFileSync(path.join(this.basePath, `${number}.${lang2Ext(language, process.platform)}`), code, {
          encoding: 'utf-8',
        });

        if (!silence) {
          ipc.send(this.webContents, 'save-code-result', { data: { isSaved: true } });
        }
      } catch (_) {
        throw new IpcError('코드 저장에 실패하였습니다.', 'code-save-error');
      }
    });

    ipc.on('load-code', (e, { data: { number, language } }) => {
      const filePath = path.join(this.basePath, `${number}.${lang2Ext(language, process.platform)}`);

      if (!fs.existsSync(filePath)) {
        const code = (() => {
          switch (language) {
            case 'C++14':
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
