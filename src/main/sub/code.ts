import { app, BrowserWindow, WebContents } from 'electron';
import fs from 'fs';
import path from 'path';
import { JS_INPUT_TEMPLATE, CPP_INPUT_TEMPLATE, PY_INPUT_TEMPLATE, JAVA_CODE_TEMPLATE } from '@/constants';
import { ipc } from '@/types/ipc';
import { langToJudgeInfo } from '@/constants/judge';
import { type Browser } from 'puppeteer-core';
import { client } from '../api';

const createDefaultCode = (language: Language) => {
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
};

const createPrompt = (inputs: string[], problemDesc: string, language: Language) => `
${problemDesc}

위 설명을 토대로 프로그래밍 언어 \`${language}\`로 \`표준 입력\`을 받기 위한 코드를 생성합니다.

---

${inputs.map(
  (input) => `
${input}

`,
)}

위는 \`표준 입력\`으로 들어올 수 있는 예시입니다.

---

${createDefaultCode(language)}

위 코드는 답변 생성에 참고만 하고, 그대로 답변에 포함시켜서는 안됩니다.

---

- 생성한 코드에 대한 설명을 절대 하지 않는다.
- Markdown 문법을 사용하지 않고 평문으로 답한다.

위는 답변을 할 때 지켜야 할 사항입니다.
`;

export class Code {
  private basePath: string;

  private webContents: WebContents;

  private puppeteerBrowser: Browser;

  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow, puppeteerBrowser: Browser) {
    this.basePath = app.getPath('userData');
    this.mainWindow = mainWindow;
    this.webContents = mainWindow.webContents;
    this.puppeteerBrowser = puppeteerBrowser;
  }

  static saveFile(basePath: string, fileName: string, ext: string, code: string) {
    fs.writeFileSync(path.join(basePath, `${fileName}.${ext}`), code, {
      encoding: 'utf-8',
    });
  }

  build() {
    ipc.on(
      'create-input-template',
      async (
        e,
        {
          data: {
            language,
            inputDesc,
            testCase: { inputs },
          },
        },
      ) => {
        const stream = await client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          stream: true,
          messages: [
            {
              role: 'user',
              content: createPrompt(inputs, inputDesc || '', language),
            },
          ],
        });

        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of stream) {
          const {
            delta: { content },
          } = chunk.choices[0];

          ipc.send(this.webContents, 'ai-result', { data: { text: content || '' } });
        }
      },
    );

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
        const code = createDefaultCode(language);

        fs.writeFileSync(filePath, code, { encoding: 'utf-8' });
      }

      const code = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      });

      ipc.send(this.webContents, 'load-code-result', { data: { code } });
    });
  }
}
