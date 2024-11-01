import { BrowserWindow, WebContentsView, app } from 'electron';

import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import * as cheerio from 'cheerio';

import { Text } from 'domhandler';
import { spawn } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';

import { ipc } from './util';

export default class BojView {
  private view: WebContentsView;

  private mainWindow: BrowserWindow;

  private widthRatio: number;

  private puppeteerBroswer: import('puppeteer-core').Browser;

  private problemNumber = '';

  private inputs: string[] = [];

  private outputs: string[] = [];

  constructor(mainWindow: BrowserWindow, widthRatio = 50) {
    this.mainWindow = mainWindow;

    this.view = new WebContentsView();

    this.widthRatio = widthRatio;
  }

  async build() {
    this.view.webContents.loadURL('https://www.acmicpc.net/problem/1000');

    this.attachView();

    this.attachEvent();

    this.updateWidth(this.widthRatio);

    this.puppeteerBroswer = await pie.connect(app, puppeteer);
  }

  attachView() {
    this.mainWindow.contentView.addChildView(this.view);
  }

  attachEvent() {
    this.view.webContents.on('did-navigate', async (e, url) => {
      const BOJ_DOMAIN = 'www.acmicpc.net';

      if (!url.startsWith(`https://${BOJ_DOMAIN}`)) {
        this.view.webContents.loadURL(`https://${BOJ_DOMAIN}`);

        return;
      }

      if (url.startsWith(`https://${BOJ_DOMAIN}/problem`)) {
        const result = new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url);

        if (!result) {
          return;
        }

        /**
         * BroswerView(deprecated) -> WebContentsView
         *
         * electron-in-puppeteer 에서 업데이트 되지 않음.
         */
        // @ts-ignore
        const page = await pie.getPage(this.puppeteerBroswer, this.view);

        const content = await page.content();

        const $ = cheerio.load(content);

        const inputs = Array.from($('[id|="sample-input"]'))
          .map((v) => {
            const [child] = v.children;

            if (!(child instanceof Text)) {
              return null;
            }

            return child.data;
          })
          .filter((v) => v !== null);

        const outputs = Array.from($('[id|="sample-output"]'))
          .map((v) => {
            const [child] = v.children;

            if (!(child instanceof Text)) {
              return null;
            }

            return child.data;
          })
          .filter((v) => v !== null);

        const problemNumber = result[1];

        this.problemNumber = problemNumber;
        this.inputs = inputs;
        this.outputs = outputs;

        ipc.send(this.mainWindow, 'load-problem-data', {
          data: {
            number: problemNumber,
            testCase: {
              inputs,
              outputs,
            },
          },
        });

        return;
      }

      ipc.send(this.mainWindow, 'load-problem-data', { data: null });
    });

    ipc.on('change-boj-view-ratio', (e, { data: { widthRatio } }) => {
      this.updateWidth(widthRatio);
    });

    // [ ]: 파일 생성, 채점 과정 모두에서 에러가 발생했을 때 처리 필요
    ipc.on('judge-start', async (e, { data: { code, ext } }) => {
      const basePath = app.getPath('userData');

      const nodeBinPath =
        process.env.NODE_ENV === 'development'
          ? path.join(__dirname, '..', '..', 'assets', 'node.exe')
          : path.join(process.resourcesPath, 'assets', 'node.exe');

      /**
       * 파일 생성
       */
      const fileName = `${this.problemNumber}.${ext}`;

      const codePath = `${basePath}/${fileName}`;

      fs.writeFileSync(codePath, code);

      /**
       * 채점
       */
      for (let i = 0; i < this.inputs.length; i += 1) {
        let error = '';

        let output = '';

        const start = Date.now();

        // [ ]: 최적화 필요
        fs.writeFileSync(`${basePath}/input`, this.inputs[i]);

        const result = await new Promise<JudgeResult['result']>((resolve) => {
          const outputProcess = spawn(`${nodeBinPath} ${codePath}`, {
            cwd: basePath,
            shell: true,
            timeout: 5000,
          });

          outputProcess.stdout.on('data', (buf) => {
            /**
             * 자주 사용되지 않는 정규식이라고 에러를 발생시킴.
             * 비활성화해도 상관없는 eslint rule
             *
             * https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression
             */
            // eslint-disable-next-line no-control-regex
            const cleanText = buf.toString().replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');

            output = cleanText;

            resolve(cleanText === this.outputs[i] ? '성공' : '실패');
          });

          outputProcess.stderr.on('data', (buf) => {
            error = buf.toString();

            resolve('에러 발생');
          });

          outputProcess.on('close', (endCode) => {
            /**
             * code 0 : 정상종료
             * code null : 비정상종료(timeout 에 의한 종료)
             */
            if (endCode === null) {
              resolve('시간 초과');
            }

            resolve('실패');
          });
        });

        const end = Date.now();

        const elapsed = end - start;

        ipc.send(this.mainWindow, 'judge-result', {
          data: { index: i, stderr: error, stdout: output, elapsed, result },
        });
      }
    });

    ipc.on('save-code', (e, { data: { number, ext, code } }) => {
      const basePath = app.getPath('userData');

      const filePath = path.join(basePath, `${number}.${ext}`);

      let isSaved;

      try {
        fs.writeFileSync(filePath, code, {
          encoding: 'utf-8',
        });

        isSaved = true;
      } catch (_) {
        isSaved = false;
      }

      ipc.send(this.mainWindow, 'save-code-result', { data: { isSaved } });
    });

    ipc.on('load-code', (e, { data: { number, ext } }) => {
      const basePath = app.getPath('userData');

      const filePath = path.join(basePath, `${number}.${ext}`);

      const code = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, {
            encoding: 'utf-8',
          })
        : '';

      ipc.send(this.mainWindow, 'load-code-result', { data: { code } });
    });
  }

  updateHeight(height: number) {
    const bounds = this.view.getBounds();

    this.view.setBounds({ ...bounds, height });
  }

  updateWidth(widthRatio: number = this.widthRatio) {
    this.widthRatio = widthRatio;

    const { width, height } = this.mainWindow.getBounds();

    this.view.setBounds({
      x: 0,
      y: 0,
      width: (width * this.widthRatio) / 100,
      height,
    });
  }

  get bojView() {
    return this.view;
  }
}
