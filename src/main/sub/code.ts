import { app, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';

import { ipc } from '../../types/ipc';
import { IpcError } from '../../error';

import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE } from '../../constants';

export class Code {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  build() {
    ipc.on('save-code', (e, { data: { number, ext, code } }) => {
      try {
        fs.writeFileSync(path.join(this.basePath, `${number}.${ext}`), code, { encoding: 'utf-8' });

        ipc.send(this.webContents, 'save-code-result', { data: { isSaved: true } });
      } catch (_) {
        throw new IpcError('코드 저장 실패', 'code-save-error');
      }
    });

    ipc.on('load-code', (e, { data: { number, ext } }) => {
      const filePath = path.join(this.basePath, `${number}.${ext}`);

      const code = (() => {
        if (!fs.existsSync(filePath)) {
          switch (ext) {
            case 'cpp':
              return CPP_INPUT_TEMPLATE;
            case 'js':
              return JS_INPUT_TEMPLATE;
            default:
              return '';
          }
        }

        return fs.readFileSync(filePath, {
          encoding: 'utf-8',
        });
      })();

      ipc.send(this.webContents, 'load-code-result', { data: { code } });
    });
  }
}
