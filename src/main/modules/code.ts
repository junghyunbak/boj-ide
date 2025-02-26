import { app, BrowserWindow, WebContents } from 'electron';

import fs from 'fs';
import path from 'path';

import {
  JS_INPUT_TEMPLATE,
  CPP_INPUT_TEMPLATE,
  PY_INPUT_TEMPLATE,
  JAVA_CODE_TEMPLATE,
  langToJudgeInfo,
} from '@/main/constants';

import { ipc } from '@/main/utils';

export class Code {
  private basePath: string;

  private webContents: WebContents;

  constructor(mainWindow: BrowserWindow) {
    this.basePath = app.getPath('userData');
    this.webContents = mainWindow.webContents;
  }

  static saveFile(basePath: string, fileName: string, ext: string, code: string) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, {
      encoding: 'utf-8',
    });
  }

  private loadDefaultCodeFile(language: Language, ext: string) {
    const defaultFilePath = path.join(this.basePath, `default.${ext}`);

    const defaultCode = (() => {
      switch (language) {
        case 'C++14':
        case 'C++17':
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

    if (!fs.existsSync(defaultFilePath)) {
      fs.writeFileSync(defaultFilePath, defaultCode, { encoding: 'utf-8' });
    }

    return fs.readFileSync(defaultFilePath, { encoding: 'utf-8' });
  }

  build() {
    ipc.on('load-files', () => {
      fs.readdir(this.basePath, (err, files) => {
        const problemNumbers = new Set<number>();

        files.forEach((file) => {
          const [_, problemNumber] = /([0-9]+)\.(js|cc|cpp|py|java)/.exec(file) || [];

          if (problemNumber) {
            problemNumbers.add(+problemNumber);
          }
        });

        ipc.send(this.webContents, 'load-files-result', {
          data: {
            problemNumbers: Array.from(problemNumbers),
          },
        });
      });
    });

    ipc.handle('save-code', async (e, { data: { code, number, language } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      try {
        Code.saveFile(this.basePath, number, ext, code);
      } catch (_) {
        throw new Error('코드 저장에 실패하였습니다.');
      }

      return { data: { isSaved: true } };
    });

    ipc.handle('save-default-code', async (e, { data: { code, language } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      const defaultFilePath = path.join(this.basePath, `default.${ext}`);

      fs.writeFileSync(defaultFilePath, code, { encoding: 'utf-8' });

      return { data: { isSaved: true } };
    });

    ipc.handle('load-code', async (e, { data: { number, language } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      const filePath = path.join(this.basePath, `${number}.${ext}`);

      if (!fs.existsSync(filePath)) {
        const code = this.loadDefaultCodeFile(language, ext);

        fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
      }

      const code = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });

      ipc.send(this.webContents, 'load-code-result', {
        data: { code },
      });

      return { data: { code } };
    });
  }
}
