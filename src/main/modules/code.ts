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

  public save(data: CodeInfo) {
    const ext = this.getExt(data.language);

    fs.writeFileSync(path.join(this.basePath, `${data.number}.${ext}`), data.code, {
      encoding: 'utf-8',
    });
  }

  private load(data: MyOmit<CodeInfo, 'code'>) {
    const ext = this.getExt(data.language);
    const filePath = path.join(this.basePath, `${data.number}.${ext}`);

    if (!fs.existsSync(filePath)) {
      const code = this.loadDefaultCode(data.language);

      fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
    }

    return fs.readFileSync(filePath, {
      encoding: 'utf-8',
    });
  }

  private loadDefaultCode(language: Language) {
    const ext = this.getExt(language);
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

  private getExt(language: Language) {
    const ext = langToJudgeInfo[language].ext[process.platform];

    if (!ext) {
      throw new Error('지원하지 않는 플랫폼입니다.');
    }

    return ext;
  }

  private getDefaultCodePath(language: Language) {
    const ext = this.getExt(language);

    const defaultFilePath = path.join(this.basePath, `default.${ext}`);

    return defaultFilePath;
  }

  build() {
    ipc.handle('save-code', async (e, { data }) => {
      this.save(data);

      return { data: { isSaved: true } };
    });

    ipc.handle('save-default-code', async (e, { data: { code, language } }) => {
      const defaultCodePath = this.getDefaultCodePath(language);

      fs.writeFileSync(defaultCodePath, code, { encoding: 'utf-8' });

      return { data: { isSaved: true } };
    });

    ipc.handle('load-code', async (e, { data }) => {
      const code = this.load(data);

      ipc.send(this.webContents, 'load-code-result', {
        data: { code },
      });

      return undefined;
    });
  }
}
