import { app, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';
import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE, PY_INPUT_TEMPLATE, JAVA_CODE_TEMPLATE } from '@/constants';
import { ipc } from '@/types/ipc';
import { langToJudgeInfo } from '@/constants/judge';

export class Code {
  private basePath: string;

  private webContents: WebContents;

  constructor(webContents: WebContents) {
    this.basePath = app.getPath('userData');

    this.webContents = webContents;
  }

  static saveFile(basePath: string, fileName: string, ext: string, code: string) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, {
      encoding: 'utf-8',
    });
  }

  build() {
    ipc.on('save-code', (e, { data: { number, language, code, silence } }) => {
      const ext = langToJudgeInfo[language].ext[process.platform];

      if (!ext) {
        throw new Error('지원하지 않는 플랫폼입니다.');
      }

      try {
        Code.saveFile(this.basePath, number, ext, code);

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

      // [ ]: c++14, c++17 이 각각의 파일을 가지도록 구현
      const filePath = path.join(this.basePath, `${number}.${ext}`);

      if (!fs.existsSync(filePath)) {
        const code = (() => {
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

        fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
      }

      const code = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });

      ipc.send(this.webContents, 'load-code-result', { data: { code } });
    });
  }
}
